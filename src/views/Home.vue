<template>
<main class="flex-1 bg-white rounded-lg p-4 overflow-y-auto" style="max-height: calc(100vh - 6rem);">
    <div class="h-full " ref="feedEl">
      <div class="max-w-4xl mx-auto p-6 space-y-6">

        <!-- إنشاء منشور -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div class="flex space-x-4">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
            </div>
            <textarea
              v-model="newPost"
              placeholder="ما الذي يدور في ذهنك؟ شاركنا بأفكارك وأخبارك..."
              class="flex-1 resize-none outline-none text-gray-800 placeholder-gray-500 text-lg bg-gray-50 rounded-2xl px-4 py-3 min-h-[120px] focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
              rows="4"
            ></textarea>
          </div>

          <!-- معاينة الصورة -->
          <div v-if="imagePreview" class="relative">
            <img :src="imagePreview" class="rounded-xl max-h-96 w-full object-cover shadow-md" />
            <button @click="removeImage" class="absolute top-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- أدوات النشر -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <ImageIcon class="w-6 h-6" />
                <span class="text-sm font-medium">صورة</span>
                <input type="file" accept="image/*" @change="handleImageChange" class="hidden" />
              </label>
              <button class="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50">
                <Video class="w-6 h-6" />
                <span class="text-sm font-medium">فيديو</span>
              </button>
              <button @click="showEmojiPicker = !showEmojiPicker" class="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-yellow-600 transition-colors p-2 rounded-lg hover:bg-yellow-50">
                <Smile class="w-6 h-6" />
                <span class="text-sm font-medium">إيموجي</span>
              </button>
            </div>
            <button
              @click="addPost"
              :disabled="isPosting || (!newPost.trim() && !selectedImage)"
              class="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{{ isPosting ? 'جاري النشر...' : 'نشر' }}</span>
              <Share2 v-if="!isPosting" class="w-5 h-5" />
            </button>
          </div>

          <!-- منتقي الإيموجي -->
          <div v-if="showEmojiPicker" class="border-t pt-4">
            <div class="flex flex-wrap gap-2">
              <button v-for="emoji in ['😊', '😂', '❤️', '🔥', '👍', '🎉', '👏', '🙏']" :key="emoji" @click="addEmoji(emoji)" class="text-2xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-gray-100">
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>

        <!-- فلاتر المحتوى -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div class="flex space-x-4">
            <button 
              v-for="tab in ['all', 'images', 'videos', 'text']" 
              :key="tab"
              @click="filterPosts(tab)"
              :class="activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {{ tab === 'all' ? 'الكل' : tab === 'images' ? 'الصور' : tab === 'videos' ? 'الفيديوهات' : 'النصوص' }}
            </button>
          </div>
        </div>

        <!-- المنشورات -->
        <div v-for="post in postStore.posts" :key="post.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
          <!-- رأس المنشور -->
          <div class="p-6 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {{ post.author.name.charAt(0) }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 text-lg">{{ post.author.name }}</h3>
                <p class="text-sm text-gray-500 flex items-center space-x-2">
                  <span>{{ formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) }}</span>
                  <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span class="flex items-center space-x-1">
                    <Users class="w-4 h-4" />
                    <span>عام</span>
                  </span>
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button @click="savePost(post.id)" class="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                <Heart class="w-5 h-5" />
              </button>
              <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- محتوى المنشور -->
          <div class="px-6 pb-4">
            <p class="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">{{ post.content }}</p>
          </div>

          <!-- صورة المنشور -->
          <div v-if="post.image" class="px-6 pb-6">
            <img :src="post.image" class="rounded-xl w-full max-h-96 object-cover shadow-md" />
          </div>

          <!-- إحصائيات المنشور -->
          <div class="px-6 py-4 border-t border-gray-100">
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-4">
                <span class="flex items-center space-x-1">
                  <Heart class="w-4 h-4 text-red-500" />
                  <span>{{ post.likesCount }} إعجاب</span>
                </span>
                <span class="flex items-center space-x-1">
                  <MessageCircle class="w-4 h-4 text-blue-500" />
                  <span>{{ post.commentsCount }} تعليق</span>
                </span>
                <span class="flex items-center space-x-1">
                  <Share2 class="w-4 h-4 text-green-500" />
                  <span>{{ post.sharesCount }} مشاركة</span>
                </span>
              </div>
            </div>
          </div>

          <!-- أزرار التفاعل -->
          <div class="px-6 py-3 border-t border-gray-100 grid grid-cols-3 gap-2">
            <button
              @click="likePost(post.id)"
              class="flex items-center justify-center space-x-2 py-3 rounded-xl transition-all font-medium"
              :class="post.isLiked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'"
            >
              <Heart :class="{ 'fill-current': post.isLiked }" class="w-5 h-5" />
              <span>إعجاب</span>
            </button>
            <button
              @click="toggleComments(post.id)"
              class="flex items-center justify-center space-x-2 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-medium"
            >
              <MessageCircle class="w-5 h-5" />
              <span>تعليق</span>
            </button>
            <button
              @click="sharePost(post.id)"
              class="flex items-center justify-center space-x-2 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all font-medium"
            >
              <Share2 class="w-5 h-5" />
              <span>مشاركة</span>
            </button>
          </div>

          <!-- قسم التعليقات -->
          <div v-if="showComments[post.id]" class="border-t border-gray-100 p-6 space-y-4">
            <!-- تعليقات موجودة -->
            <div v-for="comment in post.comments" :key="comment.id" class="flex space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {{ comment.author.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <div class="bg-gray-50 rounded-2xl px-4 py-3">
                  <h4 class="font-semibold text-gray-900 text-sm">{{ comment.author.name }}</h4>
                  <p class="text-gray-700 mt-1">{{ comment.content }}</p>
                </div>
                <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{{ formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) }}</span>
                  <button class="hover:text-blue-600">إعجاب</button>
                  <button class="hover:text-blue-600">رد</button>
                </div>
              </div>
            </div>

            <!-- إضافة تعليق جديد -->
            <div class="flex space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
              </div>
              <div class="flex-1">
                <textarea
                  v-model="newComment[post.id]"
                  placeholder="اكتب تعليقاً..."
                  class="w-full resize-none outline-none text-gray-800 placeholder-gray-500 bg-gray-50 rounded-2xl px-4 py-3 min-h-[60px] focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                  rows="2"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button
                    @click="addComment(post.id)"
                    :disabled="isCommenting[post.id] || !newComment[post.id]?.trim()"
                    class="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-blue-700 transition-all"
                  >
                    {{ isCommenting[post.id] ? 'جاري الإرسال...' : 'تعليق' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- تحميل -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-flex items-center space-x-3">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="text-gray-600">جاري تحميل المزيد من المنشورات...</span>
          </div>
        </div>

        <div v-if="!postStore.hasMore && postStore.posts.length > 0" class="text-center py-12">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              ✓
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">وصلت إلى النهاية!</h3>
            <p class="text-gray-600">لقد شاهدت كل المنشورات المتاحة حالياً.</p>
          </div>
        </div>

        <!-- لا توجد منشورات -->
        <div v-if="postStore.posts.length === 0 && !isLoading" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
              ?
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">لا توجد منشورات بعد</h3>
            <p class="text-gray-600 text-lg mb-6">كن أول من ينشر محتوى رائع في مجتمعنا!</p>
            <button 
              @click="goTo('/create-post')"
              class="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              ابدأ بنشر أول منشور
            </button>
          </div>
        </div>
      </div>
    </div>
</main>
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


const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()
const toast = useToast()

const user = computed(() => authStore.user)

// === حالة المنشور الجديد ===
const newPost = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)
const isPosting = ref(false)
const showEmojiPicker = ref(false)

// === تحميل المنشورات ===
const feedEl = ref(null)
onMounted(async () => {
  await postStore.fetchPosts()
})

useInfiniteScroll(
  feedEl,
  async () => {
    if (postStore.hasMore) await postStore.fetchPosts()
  },
  { distance: 500 }
)

// === رفع الصورة ===
const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => { imagePreview.value = e.target.result }
    reader.readAsDataURL(file)
  } else {
    toast.error('اختر صورة صالحة')
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
}

const addEmoji = (emoji) => {
  newPost.value += emoji
}

// === إنشاء منشور ===
const addPost = async () => {
  if (!newPost.value.trim() && !selectedImage.value) return
  isPosting.value = true

  const formData = new FormData()
  formData.append('content', newPost.value)
  if (selectedImage.value) formData.append('image', selectedImage.value)

  try {
    await postStore.createPost(formData)
    newPost.value = ''
    selectedImage.value = null
    imagePreview.value = null
    showEmojiPicker.value = false
    toast.success('تم النشر بنجاح!')
  } catch (err) {
    toast.error(err.response?.data?.message || 'فشل في نشر المنشور')
  } finally {
    isPosting.value = false
  }
}

// === الإعجاب ===
const likePost = async (postId) => {
  try {
    await postStore.likePost(postId)
  } catch {
    toast.error('فشل في تسجيل الإعجاب')
  }
}

// === التعليقات ===
const showComments = ref({})
const newComment = ref({})
const isCommenting = ref({})

const toggleComments = (postId) => {
  showComments.value[postId] = !showComments.value[postId]
}

const addComment = async (postId) => {
  if (!newComment.value[postId]?.trim()) return
  isCommenting.value[postId] = true

  try {
    await postStore.addComment(postId, newComment.value[postId])
    newComment.value[postId] = ''
    toast.success('تم إضافة التعليق')
  } catch {
    toast.error('فشل في إضافة التعليق')
  } finally {
    isCommenting.value[postId] = false
  }
}

// === المشاركة ===
const sharePost = async (postId) => {
  try {
    await postStore.sharePost(postId)
    toast.success('تم مشاركة المنشور')
  } catch {
    toast.error('فشل في مشاركة المنشور')
  }
}

// === الحفظ ===
const savePost = async (postId) => {
  try {
    await postStore.savePost(postId)
    toast.success('تم حفظ المنشور')
  } catch {
    toast.error('فشل في حفظ المنشور')
  }
}


// === تنقل ===
const goTo = (path) => router.push(path)

// === البحث ===



// === الإشعارات ===
const notifications = ref([])

const fetchNotifications = async () => {
  try {
    // سيتم استدعاء API الإشعارات هنا
    notifications.value = [
      { id: 1, message: 'قام أحمد بتعليق على منشورك', read: false, timestamp: new Date() },
      { id: 2, message: 'قامت سارة بمشاركة منشورك', read: true, timestamp: new Date() }
    ]
  } catch {
    toast.error('فشل في تحميل الإشعارات')
  }
}

// === الإحصائيات ===



// === حالة التحميل ===
const isLoading = computed(() => postStore.loading)

// === إدارة الحالة ===
const activeTab = ref('all')
const filterPosts = (tab) => {
  activeTab.value = tab
  // سيتم تطبيق الفلتر هنا
}

// === النسخ الاحتياطي ===


onMounted(() => {
  fetchNotifications()
})
</script>
