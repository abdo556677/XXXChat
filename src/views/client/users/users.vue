<template>
    <main
        class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="max-w-6xl mx-auto">
            <!-- Friends Navigation Tabs -->
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
            >
                <div class="flex space-x-4 overflow-x-auto">
                    <button
                        v-for="tab in friendsTabs"
                        :key="tab.id"
                        @click="activeFriendsTab = tab.id"
                        :class="
                            activeFriendsTab === tab.id
                                ? 'text-blue-600 border-blue-600 bg-blue-50'
                                : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100'
                        "
                        class="px-6 py-3 border font-medium whitespace-nowrap transition-all rounded-lg"
                    >
                        <div class="flex items-center space-x-2">
                            <component :is="tab.icon" class="w-5 h-5" />
                            <span>{{ tab.name }}</span>
                            <span
                                v-if="tab.count"
                                class="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                                {{ tab.count }}
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Tab Content -->
            <div class="space-y-6">
                <!-- Following Tab -->
                <div
                    v-if="activeFriendsTab === 'following'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div class="flex items-center justify-between mb-6">
                        <!-- Title section -->
                        <div class="flex items-center gap-2">
                            <div
                                class="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
                            >
                                <Users class="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-900">
                                    Following
                                </h3>
                                <p class="text-sm text-gray-500 mt-0.5">
                                    {{ followingCount }} people
                                </p>
                            </div>
                        </div>

                        <!-- Controls section -->
                        <div class="flex items-center gap-2">
                            <!-- Sort dropdown -->
                            <div class="relative">
                                <select
                                    v-model="sortBy"
                                    class="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 appearance-none hover:border-gray-300 min-w-[180px]"
                                >
                                    <option value="recent">الأحدث</option>
                                    <option value="name">بالاسم</option>
                                    <option value="mutual">
                                        الأكثر صداقات مشتركة
                                    </option>
                                </select>
                                <!-- <ChevronDown
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                /> -->
                            </div>
                        </div>
                    </div>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                    >
                        <div
                            v-for="user in userStore.following"
                            :key="user.id"
                            class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200 group"
                        >
                            <userCard :user="user" />
                        </div>
                    </div>

                    <!-- Load More -->
                    <div v-if="hasMoreFollowing" class="text-center mt-8">
                        <button
                            @click="loadMoreFollowing"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            تحميل المزيد من المتابعين
                        </button>
                    </div>
                </div>

                <!-- Followers Tab -->
                <div
                    v-if="activeFriendsTab === 'followers'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <div class="flex items-center justify-between mb-6">
                        <!-- Title section -->
                        <div class="flex items-center gap-2">
                            <div
                                class="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl"
                            >
                                <Users class="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 class="text-xl font-bold text-gray-900">
                                    Followers
                                </h3>
                                <p class="text-sm text-gray-500 mt-0.5">
                                    <!-- {{ followingCount }} people -->
                                </p>
                            </div>
                        </div>

                        <!-- Controls section -->
                        <div class="flex items-center gap-2">
                            <!-- Sort dropdown -->
                            <div class="relative">
                                <select
                                    v-model="sortBy"
                                    class="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 appearance-none hover:border-gray-300 min-w-[180px]"
                                >
                                    <option value="recent">الأحدث</option>
                                    <option value="name">بالاسم</option>
                                    <option value="mutual">
                                        الأكثر صداقات مشتركة
                                    </option>
                                </select>
                                <!-- <ChevronDown
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                /> -->
                            </div>
                        </div>
                    </div>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                    >
                        <div
                            v-for="user in userStore.followers"
                            :key="user.id"
                            class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200 group"
                        >
                            <userCard :user="user" />
                        </div>
                    </div>

                    <!-- Load More -->
                    <div v-if="hasMoreFollowing" class="text-center mt-8">
                        <button
                            @click="loadMoreFollowing"
                            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            تحميل المزيد من المتابعين
                        </button>
                    </div>
                </div>

                <!-- All Users Tab -->
                <div
                    v-if="activeFriendsTab === 'all'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 class="text-xl font-bold text-gray-900 mb-6">
                        جميع المستخدمين
                    </h3>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                    >
                        <div
                            v-for="user in userStore.users"
                            :key="user.id"
                            class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                            <userCard :user="user" />
                        </div>
                    </div>
                </div>

                <!-- Suggestions Tab -->
                <div
                    v-if="activeFriendsTab === 'suggestions'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 class="text-xl font-bold text-gray-900 mb-6">
                        أشخاص قد تعرفهم
                    </h3>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                    >
                        <div
                            v-for="suggestion in friendSuggestions"
                            :key="suggestion.id"
                            class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                            <div class="flex flex-col items-center text-center">
                                <!-- Suggested Friend Avatar -->
                                <div class="relative mb-3">
                                    <div
                                        class="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                                    >
                                        {{ suggestion.name.charAt(0) }}
                                    </div>
                                </div>

                                <!-- Suggested Friend Info -->
                                <h4 class="font-semibold text-gray-900 text-lg">
                                    {{ suggestion.name }}
                                </h4>
                                <p class="text-sm text-gray-500 mt-1">
                                    {{ suggestion.mutualFriends }} أصدقاء
                                    مشتركين
                                </p>

                                <!-- Mutual Friends -->
                                <div class="mt-3">
                                    <div class="flex -space-x-2 mb-2">
                                        <div
                                            v-for="mutual in suggestion.mutualFriendsList.slice(
                                                0,
                                                3,
                                            )"
                                            :key="mutual.id"
                                            class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                                        >
                                            {{ mutual.name.charAt(0) }}
                                        </div>
                                        <div
                                            v-if="suggestion.mutualFriends > 3"
                                            class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white"
                                        >
                                            +{{ suggestion.mutualFriends - 3 }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Birthdays Tab -->
                <div
                    v-if="activeFriendsTab === 'birthdays'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 class="text-xl font-bold text-gray-900 mb-6">
                        أعياد الميلاد القادمة
                    </h3>

                    <div class="space-y-4">
                        <div
                            v-for="birthday in upcomingBirthdays"
                            :key="birthday.id"
                            class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100"
                        >
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4">
                                    <div
                                        class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                    >
                                        {{ birthday.name.charAt(0) }}
                                    </div>
                                    <div>
                                        <h4
                                            class="font-semibold text-gray-900 text-lg"
                                        >
                                            {{ birthday.name }}
                                        </h4>
                                        <p class="text-sm text-gray-600">
                                            عيد الميلاد: {{ birthday.birthday }}
                                        </p>
                                        <p class="text-xs text-gray-500 mt-1">
                                            {{ birthday.daysLeft }} أيام متبقية
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    <button
                                        class="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors border border-purple-200 text-sm"
                                    >
                                        إرسال تهنئة
                                    </button>
                                    <button
                                        class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-white"
                                    >
                                        <Gift class="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="upcomingBirthdays.length === 0"
                        class="text-center py-12"
                    >
                        <div
                            class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
                        >
                            <Cake class="w-8 h-8" />
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">
                            لا توجد أعياد ميلاد قريبة
                        </h3>
                        <p class="text-gray-600">
                            سيظهر هنا أعياد ميلاد أصدقائك القادمة
                        </p>
                    </div>
                </div>

                <!-- Online Friends Tab -->
                <div
                    v-if="activeFriendsTab === 'online'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 class="text-xl font-bold text-gray-900 mb-6">
                        الأصدقاء المتصلون الآن
                    </h3>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                    >
                        <div
                            v-for="friend in onlineFriends"
                            :key="friend.id"
                            class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                            <userCard :user="friend" />
                        </div>
                    </div>

                    <div
                        v-if="onlineFriends.length === 0"
                        class="text-center py-12"
                    >
                        <div
                            class="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
                        >
                            <User class="w-8 h-8" />
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">
                            لا يوجد أصدقاء متصلون
                        </h3>
                        <p class="text-gray-600">
                            سيظهر هنا أصدقاؤك عندما يكونون متصلين
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { defineOptions } from 'vue'
import userCard from '@/components/userCard.vue'
defineOptions({
    name: 'UsersList',
})
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/users'
import {
    UserPlus,
    UserCheck,
    Gift,
    Cake,
    User,
    Users,
    Wifi,
} from 'lucide-vue-next'
import router from '@/router'

const followingCount = ref(0)
const toast = useToast()
const userStore = useUserStore()
// Tabs
const activeFriendsTab = ref('following')
const friendsTabs = computed(() => [
    {
        id: 'following',
        name: 'following',
        icon: Users,
        count: userStore.following.length,
    },
    {
        id: 'followers',
        name: 'followers',
        icon: UserCheck,
        count: userStore.followers.length,
    },
    {
        id: 'all',
        name: 'all users',
        icon: User,
        count: userStore.users.length,
    },
    {
        id: 'suggestions',
        name: 'suggestions',
        icon: UserPlus,
        count: userStore.suggestedUsers.length,
    },
    {
        id: 'birthdays',
        name: 'birthdays',
        icon: Gift,
        count: upcomingBirthdays.value.length,
    },
    {
        id: 'online',
        name: 'online',
        icon: Wifi,
        count: onlineFriends.value.length,
    },
])

const sortBy = ref('recent')
// Sample Data - Birthdays not in store, keep hardcoded
const upcomingBirthdays = ref([
    { id: 1, name: 'أحمد علي', birthday: '15 ديسمبر', daysLeft: 3 },
    { id: 2, name: 'فاطمة محمد', birthday: '20 ديسمبر', daysLeft: 8 },
    { id: 3, name: 'خالد عبدالله', birthday: '25 ديسمبر', daysLeft: 13 },
])

// Computed from store
const friendSuggestions = computed(() =>
    userStore.suggestedUsers.map(s => ({
        ...s,
        mutualFriendsList: [], // placeholder, as store doesn't have this
    })),
)
const onlineFriends = computed(() =>
    userStore.users
        .filter(u => u.isOnline)
        .map(f => ({
            ...f,
            lastActive: 'منذ دقيقتين', // placeholder
        })),
)

const hasMoreFollowing = computed(() => userStore.following.length < 50)

const loadMoreFollowing = () => {
    // Simulate loading more following
    const newFollowing = [
        {
            id: Date.now() + 1,
            name: 'جديد 1',
            mutualFriends: 2,
            friendsSince: new Date(),
            isOnline: false,
        },
        {
            id: Date.now() + 2,
            name: 'جديد 2',
            mutualFriends: 4,
            friendsSince: new Date(),
            isOnline: true,
        },
    ]
    userStore.following.push(...newFollowing)
    toast.info('تم تحميل المزيد من المتابعين')
}

onMounted(async () => {
    // Fetch friends data
    await userStore.fetchUsers()
    // await userStore.fetchFollowers()
    await userStore.fetchFollowing()
    await userStore.fetchFollowers()
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
