import request from '@/utils/request'

// 在这个文件中，我们导出了login方法，这个方法我们在user.js中用到了，我们在这里看看request方法到底是何方神圣。这个request方法是从根目录下的utils文件夹下的request.js中引入进来的。我们去这个
// 文件中看看它到底是何方神圣。这个login方法会拿到request.js文件中返回出来的response的data属性。并且会被导出。

// 代码到这里后会进入根目录下的utils文件夹下的request.js文件里先执行里面的代码。执行完毕后这里的方法会拿到request.js文件里导出来的返回值，然后再把这里的方法导出去，其实也就相当于把拿到的
// 返回值导出去

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

// 代码到这里后会进入根目录下的utils文件夹下的request.js文件里先执行里面的代码。执行完毕后这里的方法会拿到request.js文件里导出来的返回值，然后再把这里的方法导出去，其实也就相当于把拿到的
// 返回值导出去

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
