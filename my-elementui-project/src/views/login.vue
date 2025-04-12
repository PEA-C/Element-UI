<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>黑马面经运营后台</template>

      <el-form autocomplete="off" :rules="rules" :model="form" ref="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="输入用户密码"
          ></el-input>
        </el-form-item>

        <el-form-item class="tc">
          <el-button type="primary" @click="login">登 录</el-button>
          <el-button @click="reset">重 置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'login-page',
  data () {
    return {
      form: {
        username: 'admin',
        password: 'admin'
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 5,
            max: 11,
            message: '长度在 5 到 11 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^\w{5,11}$/,
            message: '请输入 5 到 10 位的密码',
            trigger: ['blur', 'change']
          }
        ]
      }

    }
  },
  methods: {
    login () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            // await this.$store.dispatch('user/loginAction', this.form)
            // const res = await loginAPI(this.form)
            // this.$store.commit('user/updateToken', res.data.token)

            await this.$store.dispatch('user/loginAction', this.form)
            this.$message.success('登录成功')
            this.$router.push('/')
          } catch (e) {
            if (e.response) {
              this.$message.error(e.response.data.message)
            } else {
              this.$message.error('登录错误')
            }
          }
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }

  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat center / cover;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .el-card {
    width: 420px;
    ::v-deep .el-card__header {
      height: 80px;
      background: rgba(114, 124, 245, 1);
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 18px;
    }
  }
  .el-form {
    padding: 0 20px;
  }
  .tc {
    text-align: center;
  }
}
</style>
