import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    async login({ commit }, credentials) {
      // 模拟登录成功
      const mockUser = {
        username: credentials.username,
        email: credentials.username
      }
      commit('SET_USER', mockUser)
      return mockUser
    },
    async register({ commit }, userData) {
      // 模拟注册成功
      const mockUser = {
        username: userData.username,
        email: userData.username
      }
      commit('SET_USER', mockUser)
      return mockUser
    },
    async logout({ commit }) {
      commit('SET_USER', null)
      return Promise.resolve()
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    currentUser: state => state.user
  }
})