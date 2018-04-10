import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login', '/authredirect'] // 不重定向白名单

// 在页面加载的时候，代码会按照执行顺序一步一步走，从main.js执行到这里，添加导航守卫
router.beforeEach((to, from, next) => {
  // token没有经过设置，所以getToken()方法返回的值是undefined，所以应该走else里的代码。所以路径会被重定向到login，加载相应的login组件，当我们点击登录按钮时，代码将会从我们点击登录按钮开始
  // 执行。
  if (getToken()) { // 判断是否有token
    // 如果有token，则先判断想要去的路径是否是login，如果是，则进入空路径。根据路由配置，空路径将会重定向到login路径。由于我们在login.vue组件里是让跳转到/Readme路径。所以这里的判断为假，
    // 执行else里的代码。
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 代码走到这里，判断store.getters.roles.length是否为0，也就是说代码会先到getters里走一圈，去看看length是否真的为0。代码去那里溜了一圈，发现默认情况下这个roles的长度的确为0。
      if (store.getters.roles.length === 0) {
        // console.log('roles====0')
        // 当roles为0的时候，发起一个action，于是代码又要回到user.js的actions里了。不过这次是去user.js的actions里的GetInfo里面去
        // 在GetInfo里溜了一圈后，拿到了用户信息，然后在回调函数then里面进行下一步的而处理
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
          // console.log('roles?', roles)
          // 在回调函数里，又发起了一个名为GenerateRoutes的action，这次是到store文件夹下的modules文件夹下的permission.js文件中的actions中去。在那里根据拿到的roles的信息来判断加载哪些
          // 路由
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            // console.log('addrouters', store.getters.addRouters)
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
      } else {
        // console.log('====1')
        next() // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    // 如果白名单里包含着当前的路径，则直接进入首页
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      // 否则回到login路径
      next('/login')
    }
  }
})

