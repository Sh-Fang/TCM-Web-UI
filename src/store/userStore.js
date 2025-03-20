import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: {
      name: '',
      email: '',
      phone: '+86 123 4567 8900',
      bio: '热爱技术，专注于图数据库和子图匹配研究。'
    }
  }),
  actions: {
    async updateUserProfile(profileData) {
      try {
        const response = await axios.post('http://localhost:8082/updateUserProfile', profileData)
        if (response.data.code === 200) {
          this.userData = response.data.data // 更新 userData
        } else {
          throw new Error(response.data.message || '更新失败')
        }
      } catch (err) {
        console.error('更新用户信息失败:', err)
        throw new Error(err.message || '更新失败')
      }
    },

    login(userData) {
        this.userData = userData
    },

    logout() {
        return new Promise((resolve) => {
            this.userInfo = null  // 清空用户信息
            resolve()  // 返回一个 Promise，确保可以用 `.then()`
        })
    }
  }
})
