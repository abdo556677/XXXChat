<template>
    <aside class="hidden xl:block w-1/4 hidden lg:block bg-white rounded-lg p-4 flex flex-col overflow-auto"style="max-height: calc(100vh - 6rem);">
        <div class="h-full p-6 space-y-8">
        <!-- التريندات -->
        <section>
            <h3 class="font-bold text-xl mb-4 text-gray-900 flex items-center gap-3">
            <TrendingUp class="w-6 h-6 text-blue-600" />
            التريندات العالمية
            </h3>
            <div class="space-y-3">
            <div v-for="trend in trends" :key="trend.id" class="cursor-pointer hover:bg-gray-50 p-4 rounded-xl transition-all border border-transparent hover:border-gray-200">
                <p class="font-semibold text-gray-900 text-lg">{{ trend.name }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ trend.posts }} منشور</p>
            </div>
            </div>
        </section>

        <!-- اقتراح أصدقاء -->
        <section>
            <h3 class="font-bold text-xl mb-4 text-gray-900">أشخاص قد تعرفهم</h3>
            <div class="space-y-4">
            <div v-for="friend in suggestedFriends" :key="friend.id" class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200">
                <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {{ friend.avatar }}
                </div>
                <div>
                    <p class="font-semibold text-gray-900">{{ friend.name }}</p>
                </div>
                </div>
                <button 
                @click="addFriend(friend.id)"
                class="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                <Plus class="w-4 h-4" /> إضافة
                </button>
            </div>
            </div>
        </section>

        <!-- الأحداث القادمة -->
        <section>
            <h3 class="font-bold text-xl mb-4 text-gray-900">الأحداث القادمة</h3>
            <div class="space-y-4">
            <div v-for="event in upcomingEvents" :key="event.id" class="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <h4 class="font-semibold text-gray-900 text-lg">{{ event.title }}</h4>
                <div class="flex items-center justify-between mt-3">
                <span class="text-sm text-gray-600">{{ event.date }}</span>
                <span class="text-sm text-gray-600">{{ event.participants }} مشترك</span>
                </div>
                <button class="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                الانضمام
                </button>
            </div>
            </div>
        </section>

        <!-- الإحصائيات العامة -->
        <section>
            <h3 class="font-bold text-xl mb-4 text-gray-900">إحصائيات المنصة</h3>
            <div class="grid grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <div class="text-2xl font-bold text-blue-600">{{ advancedStats.dailyActiveUsers }}</div>
                <div class="text-xs text-gray-600 mt-1">مستخدم نشط اليوم</div>
            </div>
            <div class="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <div class="text-2xl font-bold text-green-600">{{ advancedStats.newPostsToday }}</div>
                <div class="text-xs text-gray-600 mt-1">منشور جديد اليوم</div>
            </div>
            </div>
        </section>

        <!-- الإعدادات المتقدمة -->
        <section>
            <h3 class="font-bold text-xl mb-4 text-gray-900">الإعدادات المتقدمة</h3>
            <div class="space-y-4">
            <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700">لغة الواجهة</span>
                <select v-model="advancedSettings.language" class="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="ar">العربية</option>
                <option value="en">English</option>
                </select>
            </div>
            <button 
                @click="updateAdvancedSettings"
                class="w-full px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
                حفظ الإعدادات
            </button>
            <button 
                @click="backupData"
                class="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
                نسخ احتياطي
            </button>
            </div>
        </section>
        </div>
    </aside>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { formatDistanceToNow } from 'date-fns'
import { 
  Home, User, Users, Calendar, Settings, Bell, MessageCircle, 
  Search, Heart, Share2, MoreHorizontal, Image as ImageIcon, X,
  TrendingUp, Plus, Camera, Video, MapPin, Smile
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useInfiniteScroll } from '@vueuse/core'

const advancedSettings = ref({
  autoPlayVideos: true,
  downloadImages: false,
  privacy: 'public',
  language: 'ar'
})

const updateAdvancedSettings = async () => {
  try {
    // سيتم تحديث الإعدادات هنا
    toast.success('تم تحديث الإعدادات')
  } catch {
    toast.error('فشل في تحديث الإعدادات')
  }
}

// === الإحصائيات المتقدمة ===
const advancedStats = computed(() => ({
  dailyActiveUsers: '1.2M',
  newPostsToday: '45.7K',
  totalUsers: '15.8M'
}))

// === الترندات ===
const trends = ref([
  { id: 1, name: '#VueJS', posts: '12.5K' },
  { id: 2, name: '#TailwindCSS', posts: '8.2K' },
  { id: 3, name: '#AI', posts: '45.1K' },
  { id: 4, name: '#JavaScript', posts: '32.7K' },
  { id: 5, name: '#WebDevelopment', posts: '18.9K' }
])

// === الأصدقاء المقترحين ===
const suggestedFriends = ref([
  { id: 1, name: 'أحمد علي', mutualFriends: 3, avatar: 'أ' },
  { id: 2, name: 'فاطمة محمد', mutualFriends: 5, avatar: 'ف' },
  { id: 3, name: 'خالد عبدالله', mutualFriends: 2, avatar: 'خ' },
  { id: 4, name: 'نورة سعيد', mutualFriends: 7, avatar: 'ن' }
])

const addFriend = async (friendId) => {
  try {
    // سيتم استدعاء API إضافة صديق هنا
    toast.success('تم إرسال طلب الصداقة')
  } catch {
    toast.error('فشل في إرسال طلب الصداقة')
  }
}

// === الأحداث القادمة ===
const upcomingEvents = ref([
  { id: 1, title: 'لقاء المطورين', date: '2024-01-15', participants: 45 },
  { id: 2, title: 'ورشة عمل Vue.js', date: '2024-01-20', participants: 23 }
])
const backupData = async () => {
  try {
    // سيتم تنفيذ النسخ الاحتياطي هنا
    toast.success('تم إنشاء نسخة احتياطية من البيانات')
  } catch {
    toast.error('فشل في إنشاء نسخة احتياطية')
  }
}

// === التقارير ===
const reportPost = async (postId, reason) => {
  try {
    // سيتم إرسال التقرير هنا
    toast.success('تم الإبلاغ عن المنشور')
  } catch {
    toast.error('فشل في الإبلاغ عن المنشور')
  }
}

// === الإعدادات المتقدمة ===

</script>