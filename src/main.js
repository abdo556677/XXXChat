import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast)

// Initialize auth store
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
authStore.initialize()

app.mount('#app')

import '@/assets/main.css'
import '@/assets/styles/main.css'

