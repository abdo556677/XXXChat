import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Proxy will forward to 
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout
      const authStore = useAuthStore()
      authStore.logout()
      // Redirect to login if needed
    }
    return Promise.reject(error)
  }
)

export default api
