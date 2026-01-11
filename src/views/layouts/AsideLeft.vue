<template>
    <aside
        class="overflow-y-auto hidden md:block lg:block w-3/12 md:w-4/12 lg:w-3/12 rounded-lg p-4 flex flex-col transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800"
        style="max-height: calc(100vh - 5rem)"
    >
        <div class="h-full p-2 space-y-8">
            <nav
                class="p-2 space-y-2 rounded-2xl flex-shrink-0 border bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
            >
                <!-- Home -->
                <div
                    @click="goTo('/home')"
                    :class="{
                        'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 font-semibold':
                            router.currentRoute.value.path == '/home',
                    }"
                    class="flex items-center space-x-4 px-4 py-3 rounded-xl border border-transparent text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                    <Home class="w-6 h-6" />
                    <span class="text-lg">Home</span>
                </div>

                <!-- Profile -->
                <div
                    @click="goTo(`/profile/${user.id}`)"
                    class="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                    <User class="w-6 h-6" />
                    <span class="text-lg">Profile</span>
                </div>

                <!-- Users -->
                <div
                    @click="goTo('/users')"
                    :class="{
                        'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 font-semibold':
                            router.currentRoute.value.path == '/users',
                    }"
                    class="flex items-center space-x-4 px-4 py-3 rounded-xl border border-transparent text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                    <Users class="w-6 h-6" />
                    <span class="text-lg">Users</span>
                </div>

                <!-- Settings -->
                <div
                    @click="goTo('/settings')"
                    class="flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                    <Settings class="w-6 h-6" />
                    <span class="text-lg">Settings</span>
                </div>

                <!-- Saved -->
                <div
                    @click="goTo('/saved')"
                    :class="{
                        'text-blue-600 bg-blue-50 border-blue-100 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20 font-semibold':
                            router.currentRoute.value.path == '/saved',
                    }"
                    class="flex items-center space-x-4 px-4 py-3 rounded-xl border border-transparent text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                >
                    <Save class="w-6 h-6" />
                    <span class="text-lg">Saved</span>
                </div>
            </nav>
        </div>
    </aside>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

import { Home, User, Users, Settings, Save } from 'lucide-vue-next' //Calendar
import { computed } from 'vue'

const user = computed(() => authStore.user)
const authStore = useAuthStore()

const goTo = path => {
    router.push(path)
}
</script>
