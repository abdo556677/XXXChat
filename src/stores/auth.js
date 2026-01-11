// src/stores/auth.js
import { defineStore } from 'pinia'
import authApi from '@/services/authApi'
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: state => !!state.accessToken,
  },

  actions: {
    initialize() {
      const accessToken = localStorage.getItem('accessToken')
      const user = JSON.parse(localStorage.getItem('user'))
      if (accessToken && user) {
        this.accessToken = accessToken
        this.user = user
      }
    },

    async login(credentials) {
      this.loading = true

      try {
        const res = await authApi.login(credentials)

        if (!res.success) {
          throw new Error(res.message)
        }

        const { accessToken, user } = res.data
        // alert(user)
        // console.log('Login successful:', JSON.stringify(user))

        this.accessToken = accessToken
        this.user = user

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('user', JSON.stringify(user))

        return { success: true }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        }
      } finally {
        this.loading = false
      }
    },
    async register(credentials) {
      this.loading = true

      try {
        const res = await authApi.register(credentials)

        if (!res.success) {
          throw new Error(res.message)
        }

        // const { accessToken, user } = res.data

        // this.accessToken = accessToken
        // this.user = user

        // localStorage.setItem('accessToken', accessToken)
        // localStorage.setItem('user', user)

        return { success: true }
      } catch (error) {
        return {
          success: false,
          message: error.message,
        }
      } finally {
        this.loading = false
      }
    },
    async logout() {
      // try {
      //   await authApi.logout()
      // } catch (_) {}

      this.accessToken = null
      this.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    },
    async getTerms() {
      return await authApi.getTerms()
    },
  },
})
