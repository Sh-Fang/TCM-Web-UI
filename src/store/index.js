import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    isAuthenticated: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
    }
  },
  actions: {
    login({ commit }, credentials) {
      // This would typically be an API call
      return new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
          const user = {
            id: 1,
            name: 'John Doe',
            email: credentials.email
          }
          commit('SET_USER', user)
          resolve(user)
        }, 1000)
      })
    },
    logout({ commit }) {
      commit('SET_USER', null)
    }
  },
  modules: {
    auth: {
      namespaced: true,
      state: () => ({}),
      mutations: {},
      actions: {
        login(context, credentials) {
          return context.dispatch('login', credentials, { root: true })
        },
        logout(context) {
          return context.dispatch('logout', null, { root: true })
        }
      }
    }
  }
})