/*
  在request.js也就是本文件中，作者先是引入了axios这个ajax插件，然后又从element-ui里引入了Message和MessageBox组件，然后引入了store文件夹下导出的对象，然后又引入了根目录下的utils文件夹下的
  auth.js中的getToken，待会儿我们去store文件夹下看看store对象，再去根目录下的utils文件夹下看看auth.js中的getToken
*/
import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例，创建的方式是执行axios的create方法，我们来看看这个create方法到底是什么
// 文档中说，create()方法使用自定义配置新建一个 axios 实例，它接收一个对象作为参数，在对象里通过键值对来进行配置。
const service = axios.create({
  // 在发起ajax请求的时候这个baseURL会自动添加到链接前面去，这里是"https://easy-mock.com/mock/5a72c1ecc76727050336e0bc/mdm/",最完整的版本的源码是这个"https://api-dev"，是在config文件
  // 夹下的dev.env.js文件里配置的，我自己创建的项目在config文件夹里配置不行，但是我直接写在这个地方是可以的。这里如果不写的话，会返回一个404 not found 的错误，最完整的版本的源码里应该是作
  // 者自己配置的前缀吧，不太清楚。我这里模仿的是当前这个项目的前缀，这个项目的作者用了easy-mock，我也试了试这个，是可以的。但是好像需要自己在easy-mock里配置一些东西才行。具体怎么配置稍后再
  // 研究
  baseURL: process.env.BASE_API, // api的base_url
  // timeout选项则是规定请求必须在一定时间内完成，否则超时。
  timeout: 15000 // 请求超时时间
})

// request拦截器
// 这里是一个请求拦截器，在请求被then或catch处理前拦截他们
service.interceptors.request.use(config => {
  // 这里接收了一个参数config，这个config根据输出的结果来看，存放的应该是ajax请求缩包含的东西

  // 这里是一个if判断，判断的条件是我们引入的store对象的getters下面的token是否存在。要理解这里，需要到store文件家里面去一步一步的看源码。
  // console.log(123)
  // console.log(typeof getToken)
  // console.log(typeof getToken())
  // console.log(456)
  // console.log(config)
  // console.log(store)
  // console.log(store.getters)
  // console.log(store.getters.token)
  if (store.getters.token) {
    // 这句代码的意思是给请求的headers，也就是请求头加上一个X-Token属性，并且这个属性的值是getToken()方法返回的值。当我们的用户名是admin的时候，我们就为这个请求加上了
    // X-Token属性，并且赋值为getToken()返回的值。当用户名是editor的时候，也就不加这个属性。但是无论用户名是admin还是editor，store.getters.token这个值都是存在的，至于为什么
    // 一个加，一个不加，还需要继续研究
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // 这里把参数config返回了出去，如果单纯的只是把config返回出去，那么是没有必要添加这个拦截器的，所以这个请求拦截器的作用就是上面那个if判断，即给请求添加自定义的token
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
// 这里添加了一个响应拦截器，在请求被then或者catch处理前拦截响应
service.interceptors.response.use(
  // 如果没有出错，则会执行一个参数为response的函数。这个函数里的那些状态码、响应的信息应该是这个项目的作者自己在easy-mock里定义的。
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    // console.log(response)
    const res = response.data
    console.log(res)

    // console.log(123)
    // 如果响应的状态码不等于20000，则说明请求出问题了，则进行相应的判断、处理。
    if (res.code !== 20000) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      // 如果响应的状态码等于20000，则说明请求没有问题，则返回response的data属性。这个属性会被返回给login.js里的login方法。
      // 我有点不明白的是，这里返回的data属性是一个对象，里面明明有4个属性：avatar、name、roles、token，可是在user.js里的login方法执行后的then里面拿到的data却只剩下了token。
      // 我明白为什么了，因为在代码第一次执行到这里的时候，其他的3个属性还没有被设置，要等到登录成功后去拉取用户信息的时候发现没有用户信息，代码才会进入到拉取用户信息并设置这三个属性的流程中
      // 去。所以第一次拿到的data里会只有一个token属性

      // 代码执行到这里后，会有一个返回值，这个值会返回给login.js里的方法

      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
