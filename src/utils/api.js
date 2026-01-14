// src/utils/api.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
// إنشاء instance لـ axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ✅ مهم جداً
})

// متغير لتتبع حالة إعادة التحديث
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

// === Request interceptor: إضافة التوكن لكل طلب ===
api.interceptors.request.use(
    config => {
        // لا حاجة لإضافة Authorization header
        return config
    },
    error => Promise.reject(error),
)

// === Response interceptor: معالجة إعادة تحديث الرمز المميز ===
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        const status = error.response?.status
        const url = error.config?.url

        // تجاهل logout و refresh-token
        if (url?.includes('/auth/logout') || url?.includes('/auth/refresh-token')) {
            return Promise.reject(error)
        }

        // إذا كان 401 ولم نعيد المحاولة بعد
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // إذا كان هناك إعادة تحديث جارية، أضف الطلب للقائمة
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(() => {
                    return api(originalRequest)
                }).catch(err => {
                    return Promise.reject(err)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            const authStore = useAuthStore()

            try {
                // حاول إعادة تحديث الرمز المميز
                const refreshResult = await authStore.refreshToken()

                if (refreshResult) {
                    // إعادة التحديث نجح، أعد جميع الطلبات المعلقة
                    processQueue(null)
                    return api(originalRequest)
                } else {
                    // إعادة التحديث فشل، قم بتسجيل الخروج
                    processQueue(error, null)
                    if (authStore.user) {
                        authStore.logout()
                    }
                    return Promise.reject(error)
                }
            } catch (refreshError) {
                // خطأ في إعادة التحديث
                processQueue(refreshError, null)
                if (authStore.user) {
                    authStore.logout()
                }
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        // للأخطاء الأخرى (403، إلخ)
        if (status === 403) {
            const authStore = useAuthStore()
            if (authStore.user) {
                authStore.logout()
            }
        }

        return Promise.reject(error)
    },
)

export default api
