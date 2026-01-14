<template>
    <router-view />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from './stores/users'
import SocketService from '@/services/socket'
const userStore = useUserStore()
const isActive = ref(true)

onMounted(() => {
    console.log(import.meta.env.MODE) // development / production
    console.log(import.meta.env.VITE_API_BASE_URL)
    //   // تعيين الحالة عند التحميل
    isActive.value = !document.hidden
    userStore.isOnline = isActive.value
    if (isActive.value) {
        SocketService.connect()
    }
    // عند تغير ظهور الصفحة
    const handleVisibility = () => {
        isActive.value = !document.hidden
        console.log('visibility changed:', isActive.value)
    }

    // عند إغلاق الصفحة
    const handleUnload = () => {
        isActive.value = false
        userStore.isOnline = false
        SocketService.disconnect()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleUnload)
})

watch(isActive, val => {
    userStore.isOnline = val
})
</script>
