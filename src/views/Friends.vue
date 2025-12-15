<template>
  <main class="flex-1 bg-white rounded-lg p-4 overflow-auto" style="max-height: calc(100vh - 6rem);">
    <div class="max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">الأصدقاء</h1>
            <p class="text-gray-600 mt-2">إدارة قائمة أصدقائك وتوسيع شبكتك</p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="relative">
              <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ابحث عن أصدقاء..."
                class="w-80 pr-10 pl-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
            <button class="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center space-x-2">
              <UserPlus class="w-5 h-5" />
              <span>add</span>
            </button>
          </div>
        </div>

        <!-- Friends Stats -->
        <div class="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-100">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ friendsStats.total }}</div>
            <div class="text-sm text-gray-500">جميع الأصدقاء</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ friendsStats.recent }}</div>
            <div class="text-sm text-gray-500">مضافون حديثاً</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ friendsStats.requests }}</div>
            <div class="text-sm text-gray-500">طلبات صداقة</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ friendsStats.suggested }}</div>
            <div class="text-sm text-gray-500">مقترحون</div>
          </div>
        </div>
      </div>

      <!-- Friends Navigation Tabs -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div class="flex space-x-4 overflow-x-auto">
          <button 
            v-for="tab in friendsTabs" 
            :key="tab.id"
            @click="activeFriendsTab = tab.id"
            :class="activeFriendsTab === tab.id ? 'text-blue-600 border-blue-600 bg-blue-50' : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100'"
            class="px-6 py-3 border-b-2 font-medium whitespace-nowrap transition-all rounded-lg"
          >
            <div class="flex items-center space-x-2">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.name }}</span>
              <span v-if="tab.count" class="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                {{ tab.count }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="space-y-6">
        <!-- All Friends Tab -->
        <div v-if="activeFriendsTab === 'all'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">جميع الأصدقاء</h3>
            <div class="flex items-center space-x-3">
              <select v-model="sortBy" class="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="recent">الأحدث</option>
                <option value="name">بالاسم</option>
                <option value="mutual">الأكثر صداقات مشتركة</option>
              </select>
              <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                <Filter class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="friend in filteredFriends" :key="friend.id" class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200 group">
              <div class="flex flex-col items-center text-center">
                <!-- Friend Avatar -->
                <div class="relative mb-3">
                  <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {{ friend.name.charAt(0) }}
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <!-- Friend Info -->
                <h4 class="font-semibold text-gray-900 text-lg">{{ friend.name }}</h4>
                <p class="text-sm text-gray-500 mt-1">{{ friend.mutualFriends }} أصدقاء مشتركين</p>
                <p class="text-xs text-gray-400 mt-2">{{ formatDistanceToNow(new Date(friend.friendsSince)) }}</p>

                <!-- Action Buttons -->
                <div class="flex space-x-2 mt-4 w-full">
                  <button class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    المراسلة
                  </button>
                  <button @click="removeFriend(friend.id)" class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                    <UserMinus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More -->
          <div v-if="hasMoreFriends" class="text-center mt-8">
            <button @click="loadMoreFriends" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
              تحميل المزيد من الأصدقاء
            </button>
          </div>
        </div>

        <!-- Friend Requests Tab -->
        <div v-if="activeFriendsTab === 'requests'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">طلبات الصداقة</h3>
          
          <div v-if="friendRequests.length > 0" class="space-y-4">
            <div v-for="request in friendRequests" :key="request.id" class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {{ request.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 text-lg">{{ request.name }}</h4>
                    <p class="text-sm text-gray-500">{{ request.mutualFriends }} أصدقاء مشتركين</p>
                    <p class="text-xs text-gray-400 mt-1">أرسل طلب صداقة {{ formatDistanceToNow(new Date(request.requestDate)) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <button @click="acceptFriendRequest(request.id)" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    قبول
                  </button>
                  <button @click="rejectFriendRequest(request.id)" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    رفض
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              <UserCheck class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات صداقة</h3>
            <p class="text-gray-600">سيظهر هنا أي طلبات صداقة جديدة تتلقاها</p>
          </div>
        </div>

        <!-- Suggestions Tab -->
        <div v-if="activeFriendsTab === 'suggestions'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">أشخاص قد تعرفهم</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="suggestion in friendSuggestions" :key="suggestion.id" class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
              <div class="flex flex-col items-center text-center">
                <!-- Suggested Friend Avatar -->
                <div class="relative mb-3">
                  <div class="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {{ suggestion.name.charAt(0) }}
                  </div>
                </div>

                <!-- Suggested Friend Info -->
                <h4 class="font-semibold text-gray-900 text-lg">{{ suggestion.name }}</h4>
                <p class="text-sm text-gray-500 mt-1">{{ suggestion.mutualFriends }} أصدقاء مشتركين</p>
                
                <!-- Mutual Friends -->
                <div class="mt-3">
                  <div class="flex -space-x-2 mb-2">
                    <div v-for="mutual in suggestion.mutualFriendsList.slice(0, 3)" :key="mutual.id" 
                         class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      {{ mutual.name.charAt(0) }}
                    </div>
                    <div v-if="suggestion.mutualFriends > 3" class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white">
                      +{{ suggestion.mutualFriends - 3 }}
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-2 mt-4 w-full">
                  <button @click="sendFriendRequest(suggestion.id)" class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    إضافة صديق
                  </button>
                  <button @click="removeSuggestion(suggestion.id)" class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Birthdays Tab -->
        <div v-if="activeFriendsTab === 'birthdays'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">أعياد الميلاد القادمة</h3>

          <div class="space-y-4">
            <div v-for="birthday in upcomingBirthdays" :key="birthday.id" class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {{ birthday.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 text-lg">{{ birthday.name }}</h4>
                    <p class="text-sm text-gray-600">عيد الميلاد: {{ birthday.birthday }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ birthday.daysLeft }} أيام متبقية</p>
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <button class="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors border border-purple-200 text-sm">
                    إرسال تهنئة
                  </button>
                  <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-white">
                    <Gift class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="upcomingBirthdays.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              <Cake class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">لا توجد أعياد ميلاد قريبة</h3>
            <p class="text-gray-600">سيظهر هنا أعياد ميلاد أصدقائك القادمة</p>
          </div>
        </div>

        <!-- Online Friends Tab -->
        <div v-if="activeFriendsTab === 'online'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">الأصدقاء المتصلون الآن</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="friend in onlineFriends" :key="friend.id" class="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200">
              <div class="flex flex-col items-center text-center">
                <!-- Online Friend Avatar -->
                <div class="relative mb-3">
                  <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {{ friend.name.charAt(0) }}
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white">
                    <div class="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                  </div>
                </div>

                <!-- Online Friend Info -->
                <h4 class="font-semibold text-gray-900 text-lg">{{ friend.name }}</h4>
                <p class="text-sm text-green-600 mt-1">متصل الآن</p>
                <p class="text-xs text-gray-400 mt-2">{{ friend.lastActive }}</p>

                <!-- Action Buttons -->
                <div class="flex space-x-2 mt-4 w-full">
                  <button class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    المراسلة
                  </button>
                  <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                    <Video class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="onlineFriends.length === 0" class="text-center py-12">
            <div class="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              <User class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">لا يوجد أصدقاء متصلون</h3>
            <p class="text-gray-600">سيظهر هنا أصدقاؤك عندما يكونون متصلين</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { formatDistanceToNow } from 'date-fns'
import { 
  Search, UserPlus, UserMinus, UserCheck, Filter, 
  X, Video, Gift, Cake, User, Users,
  Clock, Calendar, Wifi
} from 'lucide-vue-next'

const toast = useToast()

// Tabs
const activeFriendsTab = ref('all')
const friendsTabs = ref([
  { id: 'all', name: 'جميع الأصدقاء', icon: Users, count: 156 },
  { id: 'requests', name: 'طلبات الصداقة', icon: UserCheck, count: 5 },
  { id: 'suggestions', name: 'مقترحون', icon: UserPlus, count: 23 },
  { id: 'birthdays', name: 'أعياد الميلاد', icon: Gift, count: 3 },
  { id: 'online', name: 'المتصلون', icon: Wifi, count: 12 }
])

// Search and Filter
const searchQuery = ref('')
const sortBy = ref('recent')

// Stats
const friendsStats = ref({
  total: 156,
  recent: 12,
  requests: 5,
  suggested: 23
})

// Sample Data
const allFriends = ref([
  { id: 1, name: 'أحمد علي', mutualFriends: 8, friendsSince: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), isOnline: true },
  { id: 2, name: 'فاطمة محمد', mutualFriends: 12, friendsSince: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), isOnline: false },
  { id: 3, name: 'خالد عبدالله', mutualFriends: 5, friendsSince: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), isOnline: true },
  { id: 4, name: 'نورة سعيد', mutualFriends: 3, friendsSince: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), isOnline: false },
  { id: 5, name: 'محمد حسن', mutualFriends: 7, friendsSince: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), isOnline: true },
  { id: 6, name: 'سارة عبدالرحمن', mutualFriends: 9, friendsSince: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), isOnline: false },
  { id: 7, name: 'عبدالعزيز سالم', mutualFriends: 4, friendsSince: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), isOnline: true },
  { id: 8, name: 'لينا أحمد', mutualFriends: 6, friendsSince: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), isOnline: false }
])

const friendRequests = ref([
  { id: 1, name: 'يوسف محمد', mutualFriends: 4, requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 2, name: 'هدى عبدالله', mutualFriends: 7, requestDate: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: 3, name: 'فيصل ناصر', mutualFriends: 2, requestDate: new Date(Date.now() - 24 * 60 * 60 * 1000) }
])

const friendSuggestions = ref([
  { id: 1, name: 'ريم خالد', mutualFriends: 8, mutualFriendsList: [
    { id: 1, name: 'أحمد علي' }, { id: 2, name: 'فاطمة محمد' }, { id: 3, name: 'خالد عبدالله' }
  ]},
  { id: 2, name: 'سعود محمد', mutualFriends: 5, mutualFriendsList: [
    { id: 4, name: 'نورة سعيد' }, { id: 5, name: 'محمد حسن' }
  ]},
  { id: 3, name: 'لطيفة أحمد', mutualFriends: 12, mutualFriendsList: [
    { id: 1, name: 'أحمد علي' }, { id: 6, name: 'سارة عبدالرحمن' }, { id: 7, name: 'عبدالعزيز سالم' }
  ]},
  { id: 4, name: 'ناصر عبدالرحمن', mutualFriends: 3, mutualFriendsList: [
    { id: 8, name: 'لينا أحمد' }
  ]}
])

const upcomingBirthdays = ref([
  { id: 1, name: 'أحمد علي', birthday: '15 ديسمبر', daysLeft: 3 },
  { id: 2, name: 'فاطمة محمد', birthday: '20 ديسمبر', daysLeft: 8 },
  { id: 3, name: 'خالد عبدالله', birthday: '25 ديسمبر', daysLeft: 13 }
])

const onlineFriends = ref([
  { id: 1, name: 'أحمد علي', lastActive: 'منذ دقيقتين' },
  { id: 3, name: 'خالد عبدالله', lastActive: 'منذ 5 دقائق' },
  { id: 5, name: 'محمد حسن', lastActive: 'منذ 10 دقائق' },
  { id: 7, name: 'عبدالعزيز سالم', lastActive: 'منذ 15 دقيقة' }
])

// Computed
const filteredFriends = computed(() => {
  let filtered = allFriends.value.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )

  // Sort
  if (sortBy.value === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'mutual') {
    filtered.sort((a, b) => b.mutualFriends - a.mutualFriends)
  } else {
    filtered.sort((a, b) => new Date(b.friendsSince) - new Date(a.friendsSince))
  }

  return filtered
})

const hasMoreFriends = computed(() => allFriends.value.length < 50)

// Methods
const removeFriend = (friendId) => {
  allFriends.value = allFriends.value.filter(friend => friend.id !== friendId)
  toast.success('تم إزالة الصديق بنجاح')
}

const acceptFriendRequest = (requestId) => {
  const request = friendRequests.value.find(req => req.id === requestId)
  if (request) {
    allFriends.value.unshift({
      id: Date.now(),
      name: request.name,
      mutualFriends: request.mutualFriends,
      friendsSince: new Date(),
      isOnline: false
    })
    friendRequests.value = friendRequests.value.filter(req => req.id !== requestId)
    toast.success('تم قبول طلب الصداقة')
  }
}

const rejectFriendRequest = (requestId) => {
  friendRequests.value = friendRequests.value.filter(req => req.id !== requestId)
  toast.info('تم رفض طلب الصداقة')
}

const sendFriendRequest = (suggestionId) => {
  friendSuggestions.value = friendSuggestions.value.filter(suggestion => suggestion.id !== suggestionId)
  toast.success('تم إرسال طلب الصداقة')
}

const removeSuggestion = (suggestionId) => {
  friendSuggestions.value = friendSuggestions.value.filter(suggestion => suggestion.id !== suggestionId)
  toast.info('تم إزالة الاقتراح')
}

const loadMoreFriends = () => {
  // Simulate loading more friends
  const newFriends = [
    { id: Date.now() + 1, name: 'جديد 1', mutualFriends: 2, friendsSince: new Date(), isOnline: false },
    { id: Date.now() + 2, name: 'جديد 2', mutualFriends: 4, friendsSince: new Date(), isOnline: true }
  ]
  allFriends.value.push(...newFriends)
  toast.info('تم تحميل المزيد من الأصدقاء')
}

onMounted(() => {
  // Fetch friends data
  console.log('Friends page mounted')
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