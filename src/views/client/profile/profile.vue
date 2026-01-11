<template>
    <main
        class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="max-w-4xl mx-auto">
            <!-- Cover Photo & Profile Info -->
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
            >
                <!-- Cover Photo -->
                <div
                    class="h-64 bg-gradient-to-br from-blue-400 to-purple-600 relative"
                >
                    <button
                        v-if="isOwnProfile"
                        class="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-opacity-100 transition-all flex items-center space-x-2"
                    >
                        <Camera class="w-4 h-4" />
                        <span>change profile photo</span>
                    </button>
                </div>

                <!-- Profile Info -->
                <div class="px-8 pb-6">
                    <div class="flex items-end justify-between -mt-16">
                        <!-- Profile Picture -->
                        <div class="relative">
                            <div
                                class="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white"
                            >
                                {{
                                    userStore.currentUser?.name
                                        ?.charAt(0)
                                        .toUpperCase() || 'م'
                                }}
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center space-x-2 mb-4">
                            <button
                                v-if="!isOwnProfile"
                                class="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center space-x-2"
                            >
                                <UserPlus class="w-4 h-4" />
                                <span>followers</span>
                            </button>
                            <button
                                v-if="!isOwnProfile"
                                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
                            >
                                <MessageCircle class="w-4 h-4" />
                                <span>message</span>
                            </button>
                            <button
                                v-if="isOwnProfile"
                                class="px-4 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                                @click="editProfile"
                                aria-label="Edit profile"
                            >
                                <Settings class="w-4 h-4" />
                                <span class="hidden sm:inline"
                                    >Edit Profile</span
                                >
                            </button>

                            <!-- More Options Dropdown -->
                            <div class="relative">
                                <button
                                    class="p-2 sm:p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-xl hover:bg-gray-100"
                                    @click="toggleOptions"
                                    aria-label="More options"
                                    aria-haspopup="true"
                                    :aria-expanded="showOptions"
                                >
                                    <MoreHorizontal class="w-5 h-5" />
                                </button>

                                <!-- Dropdown Menu -->
                                <div
                                    v-if="showOptions"
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10"
                                >
                                    <div class="py-2">
                                        <button
                                            v-if="!isOwnProfile"
                                            class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            @click="reportUser"
                                        >
                                            <Flag class="w-4 h-4" />
                                            Report User
                                        </button>
                                        <button
                                            v-if="!isOwnProfile"
                                            class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            @click="blockUser"
                                        >
                                            <Ban class="w-4 h-4" />
                                            Block
                                        </button>
                                        <button
                                            class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            @click="shareProfile"
                                        >
                                            <Share2 class="w-4 h-4" />
                                            Share Profile
                                        </button>
                                        <button
                                            class="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            @click="shareProfile"
                                        >
                                            <BadgeCheck class="w-4 h-4" />
                                            verification
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- User Details -->
                    <div class="mt-4">
                        <h1
                            class="text-3xl font-bold text-gray-900 flex items-center justify-between"
                        >
                            <span>{{
                                userStore.currentUser?.name || 'مستخدم'
                            }}</span>

                            <!-- Display Verification Badge -->
                            <span
                                v-if="
                                    userStore.currentUser
                                        ?.verificationStatus === 'green'
                                "
                                class="text-green-500 font-semibold flex items-center space-x-1 text-base"
                            >
                                <!-- Green Verified Badge -->
                                <BadgeCheck class="w-5 h-5" />
                                <span>Official</span>
                            </span>
                            <span
                                v-if="
                                    userStore.currentUser
                                        ?.verificationStatus === 'blue'
                                "
                                class="text-blue-500 font-semibold flex items-center space-x-1 text-base"
                            >
                                <!-- Blue Verified Badge -->
                                <BadgeCheck class="w-5 h-5" />
                                <span>Famous</span>
                            </span>
                            <span
                                v-if="
                                    userStore.currentUser
                                        ?.verificationStatus === 'gold'
                                "
                                class="text-yellow-500 font-semibold flex items-center space-x-1 text-base"
                            >
                                <!-- Gold Verified Badge -->
                                <BadgeCheck class="w-5 h-5" />
                                <span>Global</span>
                            </span>
                        </h1>
                        <p class="text-gray-600 mt-2">
                            {{ userStore.currentUser?.content || 'content' }}
                        </p>
                        <p
                            class="text-gray-500 text-sm mt-1 flex items-center space-x-2"
                        >
                            <MapPin class="w-4 h-4" />
                            <span>{{
                                userStore.currentUser?.location || 'unknow'
                            }}</span>
                        </p>

                        <!-- Stats -->
                        <div
                            class="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100"
                        >
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900">
                                    {{
                                        userStore.currentUser?.followersCount ||
                                        0
                                    }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    followers
                                </div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900">
                                    {{
                                        userStore.currentUser?.followingCount ||
                                        0
                                    }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    following
                                </div>
                            </div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900">
                                    {{ userStore.currentUser?.postsCount || 0 }}
                                </div>
                                <div class="text-sm text-gray-500">posts</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Profile Navigation Tabs -->
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
            >
                <div class="flex space-x-4 overflow-x-auto">
                    <button
                        v-for="tab in profileTabs"
                        :key="tab.id"
                        @click="activeProfileTab = tab.id"
                        :class="
                            activeProfileTab === tab.id
                                ? 'text-blue-600 border-blue-600'
                                : 'text-gray-600 border-transparent hover:text-gray-900'
                        "
                        class="px-4 py-2 border-b-2 font-medium whitespace-nowrap transition-colors"
                    >
                        {{ tab.name }}
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="space-y-6">
                <!-- Posts Tab -->
                <div v-if="activeProfileTab === 'posts'" class="space-y-6">
                    <!-- User Posts -->
                    <div
                        v-for="post in postStore.getPostsByUser(
                            userStore.currentUser?.id,
                        )"
                        :key="post.id"
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                    >
                        <postCard :post="post" />
                    </div>

                    <!-- لا توجد منشورات -->
                    <div
                        v-if="
                            postStore.getPostsByUser(userStore.currentUser?.id)
                                .length === 0
                        "
                        class="text-center py-16"
                    >
                        <div
                            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12"
                        >
                            <div
                                class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6"
                            >
                                ?
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">
                                لا توجد منشورات بعد
                            </h3>
                            <p class="text-gray-600 text-lg mb-6">
                                لم يتم نشر أي محتوى حتى الآن.
                            </p>
                            <button
                                v-if="isOwnProfile"
                                @click="activeProfileTab = 'posts'"
                                class="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                ابدأ بنشر أول منشور
                            </button>
                        </div>
                    </div>
                </div>

                <!-- About Tab -->
                <div
                    v-if="activeProfileTab === 'about'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 class="text-xl font-bold text-gray-900 mb-6">
                        معلومات عني
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    التعليم
                                </h4>
                                <p class="text-gray-600">
                                    بكالوريوس علوم الحاسب - جامعة الملك سعود
                                </p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    العمل
                                </h4>
                                <p class="text-gray-600">
                                    مطور واجهات أمامية في شركة التقنية
                                </p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    المكان
                                </h4>
                                <p
                                    class="text-gray-600 flex items-center space-x-2"
                                >
                                    <MapPin class="w-4 h-4" />
                                    <span>الرياض، السعودية</span>
                                </p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    تاريخ الانضمام
                                </h4>
                                <p class="text-gray-600">يناير 2023</p>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    الاهتمامات
                                </h4>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                                        >Vue.js</span
                                    >
                                    <span
                                        class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm"
                                        >Tailwind CSS</span
                                    >
                                    <span
                                        class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                                        >UI/UX</span
                                    >
                                    <span
                                        class="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm"
                                        >JavaScript</span
                                    >
                                    <span
                                        class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm"
                                        >Web Development</span
                                    >
                                </div>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    اللغات
                                </h4>
                                <p class="text-gray-600">
                                    العربية (اللغة الأم), الإنجليزية (متقدم)
                                </p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">
                                    التواصل
                                </h4>
                                <div class="space-y-2">
                                    <p class="text-gray-600">
                                        example@email.com
                                    </p>
                                    <p class="text-gray-600">
                                        +966 55 123 4567
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- following Tab -->
                <div
                    v-if="activeProfileTab === 'followers'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900">
                            الأصدقاء
                        </h3>
                        <span class="text-gray-500"
                            >{{ userStore.following.length }} صديق</span
                        >
                    </div>
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <div
                            v-for="friend in userStore.followers"
                            :key="friend.id"
                            class="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div
                                class="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3"
                            >
                                {{ friend.name.charAt(0) }}
                            </div>
                            <h4 class="font-semibold text-gray-900">
                                {{ friend.name }}
                            </h4>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ friend.mutualFriends }} أصدقاء مشتركين
                            </p>
                            <div class="flex space-x-2 mt-3">
                                <button
                                    class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                                >
                                    عرض الملف
                                </button>
                                <button
                                    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <MessageCircle class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- following Tab -->
                <div
                    v-if="activeProfileTab === 'following'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900">
                            الأصدقاء
                        </h3>
                        <span class="text-gray-500"
                            >{{ userStore.following.length }} صديق</span
                        >
                    </div>
                    <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        <div
                            v-for="friend in userStore.following"
                            :key="friend.id"
                            class="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div
                                class="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3"
                            >
                                {{ friend.name.charAt(0) }}
                            </div>
                            <h4 class="font-semibold text-gray-900">
                                {{ friend.name }}
                            </h4>
                            <p class="text-sm text-gray-500 mt-1">
                                {{ friend.mutualFriends }} أصدقاء مشتركين
                            </p>
                            <div class="flex space-x-2 mt-3">
                                <button
                                    class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                                >
                                    عرض الملف
                                </button>
                                <button
                                    class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                                >
                                    <MessageCircle class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Photos Tab -->
                <div
                    v-if="activeProfileTab === 'photos'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-900">الصور</h3>
                        <span class="text-gray-500"
                            >{{ photos.length }} صورة</span
                        >
                    </div>
                    <div
                        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        <div
                            v-for="photo in photos"
                            :key="photo.id"
                            class="aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative"
                        >
                            <img
                                :src="photo.url"
                                class="w-full h-full object-cover"
                            />
                            <div
                                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import {
    Camera,
    MapPin,
    UserPlus,
    MessageCircle,
    Settings,
    MoreHorizontal,
    BadgeCheck,
    Flag,
    Ban,
    Share2,
} from 'lucide-vue-next'
import postCard from '@/components/PostCard.vue'
import { useUserStore } from '@/stores/users'
const showOptions = ref(false)

const userStore = useUserStore()
const authStore = useAuthStore()
// const router = useRouter()
const route = useRoute()
const postStore = usePostStore()
const user = computed(() => authStore.user)

const isOwnProfile = computed(() => route.params.id == authStore.user.id)

// Profile Tabs
const activeProfileTab = ref('posts')
const profileTabs = ref([
    { id: 'posts', name: 'posts' },
    { id: 'followers', name: 'followers' },
    { id: 'following', name: 'following' },
    { id: 'about', name: 'about' },
    { id: 'photos', name: 'photos' },
])

const photos = ref([
    {
        id: 1,
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    {
        id: 2,
        url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    {
        id: 3,
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    {
        id: 4,
        url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    {
        id: 5,
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    {
        id: 6,
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
])
const toggleOptions = () => {
    showOptions.value = !showOptions.value
}
onMounted(async () => {
    authStore.initialize()
    await postStore.fetchPosts()
    await userStore.getUserById(route.params.id)
    await userStore.fetchFollowers(route.params.id)
    await userStore.fetchFollowing(route.params.id)

    console.log()
})
</script>

<style scoped>
/* Custom scrollbar for main content */
main::-webkit-scrollbar {
    width: 6px;
}

main::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

main::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
}

main::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
