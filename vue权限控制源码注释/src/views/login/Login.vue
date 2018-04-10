<style>

.head-log {
    height: 200px;
}

.company-log {
    width: 300px;
}

.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
}

.ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 140px;
    margin: -150px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    color:#FFFFFF;
    background-color:#00d1b2;
}
.login-btn button:hover {
    color:#FFFFFF;
    background-color:#00d1b2;
}

.user-defined-style {
    top: 800px;
}

</style>

<template>

<div class="login-wrap">
    <div class="head-log">
        <img class="company-log" src="/static/images/common/company-log.png" alt="公司log" />
    </div>
    <div class="ms-title">用户admin或者editor密码随便但不能少于5位</div>
    <div class="ms-login">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="密码" v-model="loginForm.password" @keyup.enter.native="handleLogin"></el-input>
            </el-form-item>
            <!-- `checked` 为 true 或 false -->
            <!-- <el-checkbox v-model="checked">记住密码</el-checkbox> -->
            <div class="login-btn">
                <el-button :loading="loading"  @click.native.prevent="handleLogin">登录</el-button>
            </div>
        </el-form>
    </div>
</div>

</template>

<script>

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      checked: true,
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }]
      },
      loading: false
    }
  },
  methods: {
    handleLogin() {
      // 在我们点击登录按钮后，会执行handleLogin()方法，然后会进行验证，如果验证通过。则会执行下面的代码
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 发起一个名为Login的action，这个action会给store对象引入的user，然后代码的执行顺序就会跑到store文件夹下面的modules文件夹下面的user.js文件里的actions里，执行完毕后会执行then
          // 方法里面的代码，设置localStorage,然后跳转到/Readme路径，根据路由配置，加载相应的组件。然后在跳转之前，会触发permission.js里面的导航守卫，代码进入导航守卫的流程里面，判断是否有
          // token，由于代码经过之前的一次旅行，已经在旅行过程中通过根目录下的utils文件夹下的auth.js文件里的setToken()方法设置了token，所以那个判断是否有token的if语句判断就为真。然后进入
          // 条件为真时的代码块里。
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            // alert('登录成功')
            localStorage.setItem('ms_username', this.loginForm.username)
            this.$router.push('/Readme')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}

</script>
