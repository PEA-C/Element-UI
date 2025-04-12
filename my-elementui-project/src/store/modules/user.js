import { loginAPI } from '@/api/user'
import { delToken, getToken, setToken } from '@/utils/storage'

export default {
  namespaced: true,
  state: {
    token: getToken()
  },

  mutations: {
    updateToken (state, n) {
      state.token = n
      setToken(n)
    },
    logout (state) {
      state.token = ''
      delToken()
    }
  },
  actions: {
    async loginAction (context, obj) {
      const res = await loginAPI(obj)
      context.commit('updateToken', res.data.token)
    }
  }

}
