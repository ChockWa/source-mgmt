<template>
    <div :class="loginStyle">
      <div class="login-form">
        <div style="font-size:28px;margin-bottom:50px;text-align: center"><span>EShop Manager</span></div>
        <el-form ref="dataForm" :model="model" size="small">
        <el-form-item>
          <el-input v-model="model.email" placeholder="Email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="model.password" placeholder="Password" type="password"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <div style="display: flex;justify-content: center;">
            <el-input v-model="model.verifyCode" style="width:180px;margin-right:5px;" placeholder="VerificationCode"></el-input>
            <img :src="verifyCodeUrl" alt="loading" @click="genVerifyCode">
          </div>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="primary" size="small" @click="login()">login</el-button>
        </el-form-item> -->
      </el-form>
      <div style="text-align:center;">
        <el-button type="primary" size="small" @click="login()">login</el-button>
      </div>
      </div>
    </div>
</template>

<script>
import * as uuidUtil from './../../common/utils/uuid'

export default {
  name: 'Login',
  data () {
    return {
      model: {
        email: '',
        password: '',
        verifyCode: '',
        uuid: ''
      },
      verifyCodeUuid: '',
      verifyCodeUrl: ''
    };
  },
  created () {
    // this.genVerifyCode()
  },
  methods: {
    login() {
      const _this = this
      // _this.$store.dispatch("setToken", "aaaaaaaaaaaaaa");
      _this.model.uuid = _this.verifyCodeUuid
      _this.$api.user.login(_this.model).then(resp => {
        if (resp && resp.code === 0) {
          _this.$store.dispatch('setToken', resp.data.info.token)
          _this.$router.push({ path: '/idx' })
        } else {
          _this.$message.error(resp.msg)
        }
      })
    },
    genVerifyCode () {
      this.verifyCodeUuid = uuidUtil.guid()
      this.verifyCodeUrl =
        this.$store.getters.getConfig.baseUrl +
        '/auth/genVerifyCode?uuid=' +
        this.verifyCodeUuid
    },
    loginStyle () {
      const width = document.body.clientWidth
      const height = document.body.clientHeight
      return 'width:' + width + 'px;height:' + height + 'px;'
    }
  }
};
</script>

<style>
/* .login {
  position: relative;
} */
.login-form {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 250px;
  height: 50%;
  margin: auto;
}
</style>
