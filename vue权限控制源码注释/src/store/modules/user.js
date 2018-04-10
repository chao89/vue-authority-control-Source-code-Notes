import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    // 这里的token应该就是getters.js文件里getters对象下的token需要的那个返回值,这里的这个token的值是我们从根目录下的utils文件夹下的auth.js文件里引入的getToken()函数，初步判断这个函数也有
    // 一个返回值，这个返回值就是我们需要的值。我们去根目录下的utils文件夹下的auth.js文件里看看。根据我们的测试结果，getToken()方法返回的值是一个字符串，
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    // 我们在这里接收到actions提交过来的SET_TOKEN，然后执行一个函数，把上面的state作为第一个参数，然后把actions传过来的'admin'作为第二个参数，然后把state的token设置为传过来的'admin'
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {

    // 顺着我们点击登录按钮后的代码的执行顺序来到了这里，然后开始执行Login方法

    // 登录
    // 我们在这里拿到login.vue组件发起的action，执行一些代码，这个Login方法有一个context参数，这个context是一个对象，里面包含着许多我们可以用的方法。这里我们用了es6的对象解构，拿到我们
    // 需要的commit方法，Login方法的第二个参数是login.vue组件传过来的一个包含了账号密码的对象，我们将根据这个账号密码进行一些操作
    Login({ commit }, userInfo) {
      // 去掉用户输入的账号中的空格
      const username = userInfo.username.trim()
      // 返回一个promise，promise有一个函数作为参数，这个函数有两个参数，也是函数，如果状态成功，则执行resolve()方法，否则执行reject()方法
      return new Promise((resolve, reject) => {
        // 在这个函数里，我们执行了另一个函数，login函数，这个函数是我们从根目录下的api文件夹下的login.js文件里引入进来的，它需要两个参数，一个是账号，一个是密码，这个函数在login.js文件里
        // 返回了一个request函数，其实就相当于我们在这里执行了request函数，request函数有一个参数，这个参数是一个对象，里面有三个配置项，一个是url，一个是method，一个是data，其中
        // url是一个路径，method是一个post字符串，data则是一个对象，里面包含着我们传递过去的账号和密码。而这个request函数，则是在login.js文件里从另一个js文件里引入的，我们到login.js文件
        // 中去看看。这个方法是从根目录下的api文件夹下的login.js文件里引入的，它导出的是login方法，执行这个方法我们就会拿到request.js文件中返回出来的response的data属性。所以我们在then
        // 里面就可以对request.js文件中返回出来的response的data属性做文章了。

        // 代码到这里的时候，会进入到根目录下的api文件夹下的login.js文件里的login方法。然后会拿到login方法里面的返回值，然后在then方法里面进行处理

        login(username, userInfo.password).then(response => {
          console.log(response)
          // 这里我们把拿到的response的data属性赋值给变量data
          const data = response.data
          // 然后执行我们从根目录下的utils文件夹下的auth.js文件里引入的setToken方法，把data.token也就是字符串admin传入了进去。它的返回值是Cookies.set(TokenKey, token)执行之后的结果，具体
          // 值是什么暂时还不是很清楚。

          // 在这里执行了从根目录下的utils文件夹下的auth.js文件里引入的setToken()方法，这里就设置了token，然后当代码去执行根目录下的permission.js里的代码时，走到那个判断getToken()方法是
          // 否存在时，条件判断就为真了。

          setToken(data.token)
          // 在这里我们向mutations提交了SET_TOKEN，将data.token也就是'admin'传了过去
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 代码从permmision.js来到这里后，开始执行GetInfo()方法。而在GetInfo()方法里会执行getInfo()方法，这个方法也是从根目录下的api文件夹下的login.js文件里引入的。我们去那里看看

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
