import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast)
const authStore = useAuthStore()

authStore.initialize()

import { useSettingsStore } from '@/stores/settings'
const settingStore = useSettingsStore()
settingStore.initializeSettings()

app.mount('#app')

// import '@/assets/main.css
import '@/assets/styles/main.css'
import 'normalize.css/normalize.css'