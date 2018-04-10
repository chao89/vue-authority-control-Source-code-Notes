const getters = {
  // 这个token就是我们在request.js文件里要判断是否存在的那个token，这里用的是es6的写法。意思是getters有一个tokend属性，其值是一个函数的返回值，这个函数用了箭头函数的写法，参数是state，
  // 返回值则是这个参数state下的user的token，这里我判断这个值应该指的是user.js文件里的state对象下的token属性的值。如果我没判断错的话，我们去user.js文件里看看
  token: state => state.user.token,
  name: state => state.user.name,
  avatar: state => state.user.avatar,
  routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  // permmision.js里有一个判断会来这里判断roles的长度是否为0。这里用的是es6的写法。意思是getters有一个roles属性，其值是一个函数的返回值，这个函数用了箭头函数的写法，参数是state，
  // 返回值则是这个参数state下的user的roles，这里我判断这个值应该指的是user.js文件里的state对象下的roles属性的值。如果我没判断错的话，我们去user.js文件里看看。user.js文件里默认情况
  // 下，roles是一个空数组，它的长度为0。也就是说，如果我们没有对它进行操作，那么permmision.js里的那个判断的结果应该是为真。也就是说，的确是0
  roles: state => state.user.roles
}
export default getters
