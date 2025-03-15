import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      userData: null
    }
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user.userData = userData
    }
  },
  actions: {
    async login({ commit }, userData) {
      commit('SET_USER_DATA', userData)
      return userData
    },
    async register({ commit }, userData) {
      commit('SET_USER_DATA', userData)
      return userData
    },
    async logout({ commit }) {
      commit('SET_USER_DATA', null)
      return Promise.resolve()
    },
    async updateUserProfile({ commit }, profileData) {
      // 这里应该调用后端 API 更新用户资料
      commit('SET_USER_DATA', profileData)
      return Promise.resolve(profileData)
    }
  },
  getters: {
    isAuthenticated: state => !!state.user.userData,
    currentUser: state => state.user.userData
  }
})