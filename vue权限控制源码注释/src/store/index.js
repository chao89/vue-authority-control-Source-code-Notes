import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
// 这里从当前目录下的getters.js文件里引入了getters，这个getters在request.js里用到了。用来判断它里面的token是否存在
import getters from './getters'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    permission
  },
  getters
})

export default store
