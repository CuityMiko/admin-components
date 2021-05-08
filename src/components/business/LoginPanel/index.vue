<template>
  <div class="register">
    <div class="form-top">
      <p>{{ loginTitle }}</p>
      <span>登录</span>
    </div>
    <div class="form-content">
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form">
        <div>
          <el-form-item prop="userName">
            <el-input
              name="userName"
              prefix-icon="el-icon-mobile-phone"
              type="text"
              v-model="loginForm.userName"
              autocomplete="on"
              placeholder="手机号码"
              @keyup.enter.native="validateCode"
              maxlength="11"
              clearable
              size="large"
            />
          </el-form-item>
        </div>
        <div style="position: relative">
          <el-form-item prop="userPasswd" v-if="loginForm.userName.includes('admin')">
            <el-input
              name="userPasswd"
              prefix-icon="el-icon-lock"
              type="password"
              v-model="loginForm.userPasswd"
              autocomplete="on"
              placeholder="密码"
              @keyup.enter.native="validateCode"
              clearable
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item v-else class="code_item" prop="messageCode">
            <el-input
              name="messageCode"
              prefix-icon="el-icon-key"
              type="text"
              v-model="loginForm.messageCode"
              oninput="value=value.replace(/[^\d]/g,'')"
              maxLength="6"
              autocomplete="off"
              placeholder="验证码"
              @keyup.enter.native="validateCode"
              clearable
              size="large"
              style="width: 160px"
            ></el-input>
            <button type="button" @click="getCode" :class="{ disabled: !getMsgShow }" :disabled="!getMsgShow">{{ btnText }}</button>
          </el-form-item>
          <!-- <div class="forgetpw" @click="forgetpw"> 忘记密码 </div> -->
        </div>
        <div v-if="needCode == 0 ? false : true">
          <el-form-item prop="code">
            <el-input
              name="code"
              type="text"
              v-model="loginForm.code"
              autocomplete="on"
              placeholder="验证码"
              @keyup.enter.native="validateCode"
              style="width: 188px"
              maxlength="4"
              size="large"
              clearable
            ></el-input>
            <img id="img" :src="codeimg" class="img" @click="changeImg" />
          </el-form-item>
        </div>
        <div style="padding-top: 15px">
          <p @click="validateCode" class="btn">登 录</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * systemType：站点：siteplatform 再生：rebirth 分拣：sortingcenter 专家：expert
 * loginSuccess：登录回调
 * forgetPw：忘记密码操作
 */
export default {
  name: 'LoginPanel',
  props: {
    systemType: {
      type: String,
      default: 'rebirth'
    }
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      let phone = value.replace(/\s/g, '')
      let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
      if (phone.length > 0) {
        if (phone.includes('admin')) {
          callback()
        } else if (!regs.test(phone)) {
          this.getMsgShow = false
          callback([new Error('手机号不合法')])
        } else {
          this.getMsgShow = true
          callback()
        }
      }
    }
    return {
      needCode: 0,
      codeimg: '/img',
      loginForm: {
        userName: '',
        userPasswd: '',
        messageCode: '',
        code: ''
      },
      loginRules: {
        userName: [
          { validator: validatePhone, trigger: 'blur' },
          { required: true, trigger: 'blur', message: '请输入手机号码' }
        ],
        userPasswd: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
        messageCode: [{ required: true, trigger: 'blur', message: '请输入短信验证码' }]
      },
      system_type: this.systemType,
      getMsgShow: false,
      count: '',
      btnText: '获取验证码'
    }
  },
  computed: {
    // 登录标题
    loginTitle() {
      let title = ''
      switch (this.systemType) {
        case 'siteplatform': // 站点
          title = '再生资源站点'
          break
        case 'rebirth': // 再生
          title = '再生资源管理平台'
          break
        case 'sortingcenter': // 分拣
          title = '分拣中心'
          break
        case 'expert': // 专家
          title = '再生资源专家版'
          break
        default:
          break
      }
      return title
    }
  },
  mounted() {},
  methods: {
    /**
     * 登录
     * */
    validateCode() {
      let _this = this
      this.$refs.loginForm.validate(valid => {
        if (valid === true) {
          let { userName, userPasswd, code, messageCode } = _this.loginForm
          let phone = userName.includes('admin') ? '' : userName
          let params = {}
          if (userName.includes('admin')) {
            params = {
              userName,
              userPasswd,
              code
            }
          } else {
            params = {
              phone,
              messageCode
            }
          }
          let _loginCode = 2
          switch (this.systemType) {
            case 'siteplatform': // 站点
              _loginCode = 3
              break
            case 'rebirth': // 再生
              _loginCode = 2
              break
            case 'sortingcenter': // 分拣
              _loginCode = 4
              break
            case 'expert': // 专家
              _loginCode = 5
              break
            default:
              _loginCode = 2
          }
          params = Object.assign(params, { loginCode: _loginCode })
          // 调后台登陆接口
          this.$http
            .post('/usercenter/pc/loginByPhone', params)
            .then(res => {
              if (res.retCode * 1 == 0) {
                _this.$emit('loginSuccess', res)
              }
            })
            .catch(res => {
              if (res.data) {
                if (res.data.needCode) {
                  //接口登录异常,需要验证码
                  _this.needCode = 1
                }
              }
              if (this.needCode == 1) {
                _this.changeImg()
              }
            })
        }
      })
    },
    changeImg() {
      var _this = this
      this.$refs.loginForm.validateField('userName', valid => {
        if (!valid) {
          this.$http.get('/usercenter/pc/verify/code', { username: this.loginForm.userName }).then(res => {
            if (res.retCode * 1 == 0) {
              _this.codeimg = res.data
            }
          })
        }
      })
    },
    //获取验证码
    getCode() {
      this.$http
        .post('/usercenter/pc/fetchCode?t=' + Math.random(), { phone: this.loginForm.userName })
        .then(res => {
          this.codeBtnHandle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    codeBtnHandle() {
      const TIME_COUNT = 60
      let text = '获取验证码'
      if (!this.timer) {
        this.count = TIME_COUNT
        this.getMsgShow = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
            text = this.count + 's后重新发送'
          } else {
            this.getMsgShow = true
            clearInterval(this.timer)
            this.timer = null
            text = '重新获取'
          }
          this.btnText = text
        }, 1000)
      }
    },
    forgetpw() {
      this.$emit('forgetPw')
    }
  }
}
</script>

<style lang="scss" scoped>
.code_item {
  width: 280px;
  height: 40px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  .el-input ::v-deep .el-input__inner {
    height: 38px;
    border: none !important;
  }
  button {
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
    height: 100%;
    border: none;
    background: transparent;
    font-size: 14px;
    color: #1989fa;
    cursor: pointer;
    z-index: 999;
    &.disabled {
      cursor: not-allowed;
      color: #c0c4cc;
    }
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 1px;
      height: 16px;
      background: #dcdfe6;
    }
  }
}
</style>
