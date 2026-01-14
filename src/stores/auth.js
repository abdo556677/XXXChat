// src/stores/auth.js
import { defineStore } from 'pinia'
import authApi from '@/services/authApi'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null,
        refreshingToken: false,
    }),

    getters: {
        isAuthenticated: state => !!state.user,
    },

    actions: {
        async initialize() {
            await this.fetchUser()
        },

        // تحقق من الجلسة عند تحميل التطبيق مع إعادة تحديث الرمز المميز تلقائياً
        async fetchUser() {
            this.loading = true
            try {
                const res = await authApi.fetchUser()

                const data = {
                    id: res.data.user._id,
                    name: res.data.user.username,
                    email: res.data.user.email,
                    role: res.data.user.role,
                }
                this.user = data
                return true
            } catch (err) {
                // إذا فشل جلب المستخدم، حاول إعادة تحديث الرمز المميز
                if (err.response?.status === 401 && !this.refreshingToken) {
                    const refreshResult = await this.refreshToken()
                    if (refreshResult) {
                        // أعد المحاولة بعد إعادة التحديث
                        return await this.fetchUser()
                    }
                }

                this.user = null
                this.error = err.message
                return false
            } finally {
                this.loading = false
            }
        },

        // إعادة تحديث الرمز المميز
        async refreshToken() {
            if (this.refreshingToken) return false

            this.refreshingToken = true
            try {
                const result = await authApi.refreshToken()
                if (result.success) {
                    // إعادة جلب بيانات المستخدم بعد التحديث الناجح
                    await this.fetchUser()
                    return true
                }
                return false
            } catch (error) {
                console.error('Token refresh failed:', error)
                // إذا فشل إعادة التحديث، قم بتسجيل الخروج
                await this.logout()
                return false
            } finally {
                this.refreshingToken = false
            }
        },

        async login(credentials) {
            this.loading = true
            try {
                const res = await authApi.login(credentials)

                if (!res.data?.user)
                    throw new Error(res.data?.message || 'Login failed')

                this.user = res.data.user
                return { success: true }
            } catch (error) {
                return { success: false, message: error.message }
            } finally {
                this.loading = false
            }
        },

        async register(credentials) {
            this.loading = true
            try {
                const res = await authApi.register(credentials)
                return { success: true, data: res.data }
            } catch (error) {
                return { success: false, message: error.message }
            } finally {
                this.loading = false
            }
        },

        async logout() {
            this.user = null
            try {
                await authApi.logout()
            } catch (err) {
                console.error('error in logout', err)
                return null
            }
        },

        async getTerms() {
            try {
                const res = await authApi.getTerms()
                return res.data
            } catch (err) {
                console.error('Error fetching terms:', err)
                return null
            }
        },
    },
})
