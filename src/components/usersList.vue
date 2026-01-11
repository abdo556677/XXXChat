<template>
    <div class="flex flex-col items-center text-center">
        <!-- User Avatar -->
        <div class="relative mb-3">
            <div
                class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
            >
                {{ user.name.charAt(0) }}
            </div>
            <div
                v-if="user.isOnline"
                class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"
            >
                <div
                    class="w-full h-full bg-green-400 rounded-full animate-ping"
                ></div>
            </div>
        </div>

        <!-- User Info -->
        <h4 class="font-semibold text-gray-900 text-lg">
            {{ user.name }}
        </h4>
        <p class="text-sm text-gray-500 mt-1">
            {{ user.mutualFriends || 0 }} أصدقاء مشتركين
        </p>
        <p class="text-xs text-gray-400 mt-2">
            {{ user.isOnline ? 'متصل الآن' : 'غير متصل' }}
        </p>

        <!-- Action Buttons -->
        <div class="flex space-x-2 mt-4 w-full">
            <button
                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
                المراسلة
            </button>
            <button
                v-if="userStore.following.some(f => f.id === user.id)"
                @click="unfollowUser(user.id)"
                class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
                إلغاء المتابعة
            </button>
            <button
                v-else
                @click="followUserFromAll(user.id)"
                class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
                متابعة
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { defineOptions } from 'vue'

defineOptions({
    name: 'UsersList',
})
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/users'

import router from '@/router'

const toast = useToast()
const userStore = useUserStore()
// Tabs

const goto = rout => {
    router.push(rout)
}
defineProps({ user: Object })

const onlineFriends = computed(() =>
    userStore.users
        .filter(u => u.isOnline)
        .map(f => ({
            ...f,
            lastActive: 'منذ دقيقتين', // placeholder
        })),
)

// Methods
const unfollowUser = async userId => {
    await userStore.unfollowUser(userId)
}

const followUser = userId => {
    userStore.followUser(userId)
}

const followUserFromAll = userId => {
    const user = userStore.users.find(u => u.id === userId)
    if (user && !userStore.following.some(f => f.id === userId)) {
        userStore.following.push(user)
        toast.success('تم المتابعة بنجاح')
    }
}

onMounted(async () => {
    // Fetch friends data
    await userStore.fetchUsers()
})
</script>
