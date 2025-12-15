<template>
    <aside class="hidden lg:block w-1/4 bg-white rounded-lg  p-4 flex flex-col "
    style="max-height: calc(100vh - 6rem);">
        <div class="h-full flex flex-col">
            <nav class="p-6 space-y-2 flex-shrink-0">
            <div @click="goTo('/home')" class="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-blue-50 cursor-pointer text-blue-600 bg-blue-50 font-semibold border border-blue-100 transition-all">
                <Home class="w-6 h-6" />
                <span class="text-lg">الرئيسية</span>
            </div>
            <div @click="goTo(`/profile/${user?.id}`)" class="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700 transition-all">
                <User class="w-6 h-6" />
                <span class="text-lg">الملف الشخصي</span>
            </div>
            <div @click="goTo('/friends')" class="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700 transition-all">
                <Users class="w-6 h-6" />
                <span class="text-lg">الأصدقاء</span>
                <span class="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">{{ userStats.followers }}</span>
            </div>
            <div @click="goTo('/events')" class="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700 transition-all">
                <Calendar class="w-6 h-6" />
                <span class="text-lg">الأحداث</span>
            </div>
            <div @click="goTo('/groups')" class="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700 transition-all">
                <Users class="w-6 h-6" />
                <span class="text-lg">المجموعات</span>
            </div>
            <div @click="goTo('/settings')" class="flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-gray-100 cursor-pointer text-gray-700 transition-all">
                <Settings class="w-6 h-6" />
                <span class="text-lg">الإعدادات</span>
            </div>
            </nav>

            <!-- الإحصائيات -->
            <div class="p-6 border-t flex-shrink-0">
            <h3 class="font-bold text-lg mb-4 text-gray-900">إحصائياتك</h3>
            <div class="grid grid-cols-3 gap-4 text-center">
                <div class="bg-blue-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-600">{{ userStats.posts }}</div>
                <div class="text-xs text-gray-600 mt-1">منشور</div>
                </div>
                <div class="bg-green-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-green-600">{{ userStats.followers }}</div>
                <div class="text-xs text-gray-600 mt-1">متابع</div>
                </div>
                <div class="bg-purple-50 rounded-lg p-3">
                <div class="text-2xl font-bold text-purple-600">{{ userStats.following }}</div>
                <div class="text-xs text-gray-600 mt-1">متابَع</div>
                </div>
            </div>
            </div>
        </div>
    </aside>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import { 
  Home, User, Users, Calendar, Settings, Bell, MessageCircle, 
  Search, Heart, Share2, MoreHorizontal, Image as ImageIcon, X,
  TrendingUp, Plus, Camera, Video, MapPin, Smile
} from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
const user = computed(() => authStore.user)
const authStore = useAuthStore()

const userStats = computed(() => ({
  posts: user.value?.postCount || 0,
  followers: user.value?.followersCount || 0,
  following: user.value?.followingCount || 0
}))


// === الإعدادات السريعة ===
const quickSettings = ref({
  darkMode: false,
  notifications: true,
  sound: true
})

const toggleSetting = (setting) => {
  quickSettings.value[setting] = !quickSettings.value[setting]
  toast.success(`تم ${quickSettings.value[setting] ? 'تفعيل' : 'إلغاء'} ${setting}`)
}

</script>