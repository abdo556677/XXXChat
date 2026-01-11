<template>
<div class="flex flex-col items-center text-center">
    <!-- Avatar -->
    <div
        @click="goTo(`/profile/${user.id}`)"
        class="relative mb-3 cursor-pointer"
    >
        <div
            class="w-20 h-20 rounded-full flex items-center justify-center
                   text-white font-bold text-2xl shadow-lg
                   bg-gradient-to-br from-blue-400 to-indigo-500"
        >
            {{ user.name.charAt(0) }}
        </div>

        <!-- Online Indicator -->
        <div
            v-if="user.isOnline"
            class="absolute -bottom-1 -right-1 w-6 h-6
                   bg-green-500 rounded-full border-2
                   border-white dark:border-gray-900"
        >
            <div
                class="w-full h-full bg-green-400 rounded-full animate-ping"
            ></div>
        </div>
    </div>

    <!-- User Info -->
    <h4 class="font-semibold text-lg text-gray-900 dark:text-white">
        {{ user.name }}
    </h4>

    <p class="text-sm mt-1 text-gray-500 dark:text-gray-400">
        {{ user.mutualFriends || 0 }} أصدقاء مشتركين
    </p>

    <p class="text-xs mt-2"
       :class="user.isOnline
           ? 'text-green-600 dark:text-green-400'
           : 'text-gray-400 dark:text-gray-500'"
    >
        {{ user.isOnline ? 'متصل الآن' : 'غير متصل' }}
    </p>

    <!-- Actions -->
    <div class="flex space-x-2 mt-4 w-full">
        <button
            @click="createChatAndGo(user.id)"
            class="flex-1 px-3 py-2 rounded-lg text-sm font-medium
                   bg-blue-600 hover:bg-blue-700
                   text-white transition-colors"
        >
            المراسلة
        </button>

        <button
            v-if="user.isFollowing"
            @click="unfollowUser(user.id)"
            class="px-3 py-2 rounded-lg text-sm font-medium
                   border border-gray-300 dark:border-gray-600
                   text-gray-700 dark:text-gray-200
                   hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors"
        >
            unfollowing
        </button>

        <button
            v-else
            @click="followUser(user.id)"
            class="px-3 py-2 rounded-lg text-sm font-medium
                   border border-gray-300 dark:border-gray-600
                   text-gray-700 dark:text-gray-200
                   hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors"
        >
            following
        </button>
    </div>
</div>

</template>
<script setup>
// import { computed } from 'vue'
import { defineOptions } from 'vue'
import { useChatStore } from '@/stores/chat'
const chatStore = useChatStore()
defineOptions({
    name: 'UsersList',
})
import { useUserStore } from '@/stores/users'

import router from '@/router'

const userStore = useUserStore()

const goTo = rout => {
    router.push(rout)
}
defineProps({ user: Object })
// Methods
const unfollowUser = async userId => {
    await userStore.unfollowUser(userId)
}

const followUser = async userId => {
    await userStore.followUser(userId)
}
const createChatAndGo = async selectedUserId => {
    try {
        // participants = array من الـ ids، هنا فقط نضيف المستخدم الذي نريد المحادثة معه
        const participants = [selectedUserId]

        // إنشاء المحادثة
        const data = await chatStore.createNewChat(participants)

        // البيانات التي تعيدها createNewChat
        // إذا كانت تعيد { data: chat } استخدم data.data.id
        const chatId = data.id ?? data.data?.id

        if (!chatId) throw new Error("Failed to create chat")

        // الانتقال للمحادثة الجديدة
        goTo(`/chat/${chatId}`)
    } catch (error) {
        console.error("Error creating chat:", error)
    }
}

// onMounted(async () => {
//   // Fetch friends data
//   await userStore.fetchUsers()
//   // await userStore.fetchFollowers()
//   await userStore.fetchFollowing()
// })
</script>
