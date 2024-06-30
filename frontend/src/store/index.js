import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || ''
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearToken(state) {
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  actions: {
    login({ commit }, userData) {
      return axios.post('http://localhost:3000/api/auth/login', userData).then((response) => {
        commit('setToken', response.data.token)
      })
    },
    register({ commit }, userData) {
      return axios.post('http://localhost:3000/api/auth/register', userData).then((response) => {
        commit('setToken', response.data.token)
      })
    },
    logout({ commit }) {
      commit('clearToken')
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  }
})
