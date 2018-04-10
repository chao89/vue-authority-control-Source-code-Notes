import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

// 这个被导出的getToken()函数就是我们在user.js里使用的那个getToken()函数。这个函数返回的是Cookies.get(TokenKey)，这里是Cookies是引入的js-cookie这个第三方插件。get()方法应该是这个
// 第三方插件提供的获取cookie的方法，传入了一个我们自己定义的参数TokenKey，参数的值是'Admin-Token'，是一个字符串。具体这个Cookies.get(TokenKey)是什么。我们还需要验证
export function getToken() {
  return Cookies.get(TokenKey)
}

// 在这里，我们拿到了从user.js那里传过来的token值，也就是字符串"admin"，在这个setToken方法里把TokenKey的值设置为了token，也就是"admin"，然后我们在上面的getToken()方法里拿到的就是
// 'admin'了。这应该是有一个执行的先后顺序问题。
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
