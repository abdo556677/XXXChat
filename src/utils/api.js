// src/utils/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// إنشاء instance لـ axios
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// === Request interceptor: إضافة التوكن لكل طلب ===
api.interceptors.request.use(
  (config) => {
    try {
      const authStore = useAuthStore()
      const accessToken = authStore.accessToken  // نفترض أن authStore يحتوي على accessToken
      if (accessToken) {
        config.headers.Authorization = accessToken
        // console.log('Added Authorization header from Pinia:', accessToken)
      }
    } catch (err) {
      console.warn('Auth store not ready', err)
    }
    return config
  },
  (error) => Promise.reject(error)
)
// === Response interceptor: التعامل مع 401 بطريقة آمنة ===
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config

    // استثناء endpoint logout لتجنب حلقة لانهائية
    if (originalRequest?.url?.includes('/auth/logout')) {
      return Promise.reject(error)
    }

    // إذا 401 ولم يُعالج من قبل
    if (error.response?.status == 401 || error.response?.status == 403 ) { //&& !originalRequest._retry
      originalRequest._retry = true
      const authStore = useAuthStore()
      authStore.logout() // تسجيل خروج بدون loop
    }

    return Promise.reject(error)
  }
)

export default api
