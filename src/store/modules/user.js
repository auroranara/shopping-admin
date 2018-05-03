import { login, fetchUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SER_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    async Login({ commit }, userInfo) {
      const res = await login(userInfo.account, userInfo.password)
      if (res.token) {
        setToken(res.token)
        commit('SET_TOKEN', res.token)
      }
    },

    // 获取用户信息
    async GetInfo({ commit, state }) {
      const res = await fetchUserInfo(state.token)
      if (res.status && res.status === '0') {
        commit('SET_ROLES', res.role)
        commit('SER_USERINFO', res.userInfo)
        return res
      }
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SER_USERINFO', {})
        removeToken()
        resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SER_USERINFO', {})
        removeToken()
        resolve()
      })
    }
  }
}

export default user
