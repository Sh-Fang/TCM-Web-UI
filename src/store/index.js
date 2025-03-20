import { createStore } from 'vuex'
import axios from 'axios'

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
      // 调用后端 API 更新用户资料
      try{
        const response = await axios.post('http://localhost:8082/updateUserProfile', profileData)
        console.log(response.data)
        if (response.data.code === 200) {
          commit('SET_USER_DATA', response.data.data) // 更新 Vuex 状态
          return response.data.data
        } else {
          throw new Error(response.data.message || '更新失败')
        }
      }catch(err){
        console.error('更新用户信息失败:', err)
        throw new Error(err.message || '更新失败')
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.user.userData,
    currentUser: state => state.user.userData
  }
})