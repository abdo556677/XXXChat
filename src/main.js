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
async function initApp() {
    const authStore = useAuthStore()
    await authStore.fetchUser()

    const settingStore = useSettingsStore()
    settingStore.initializeSettings()

    app.mount('#app')
}

initApp()
// Initialize auth store
// import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
const settingStore = useSettingsStore()
// const authStore = useAuthStore()

settingStore.initializeSettings()
// authStore.initialize()
// console.log(authStore.initialize())

app.mount('#app')

// import '@/assets/main.css'
import '@/assets/styles/main.css'
