<template>
  <main class="flex-1 bg-white rounded-lg p-4 overflow-auto" style="max-height: calc(100vh - 6rem);">
    <div class="max-w-4xl mx-auto">
      
      <!-- Cover Photo & Profile Info -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <!-- Cover Photo -->
        <div class="h-64 bg-gradient-to-br from-blue-400 to-purple-600 relative">
          <button v-if="isOwnProfile" class="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-opacity-100 transition-all flex items-center space-x-2">
            <Camera class="w-4 h-4" />
            <span>تغيير صورة الغلاف</span>
          </button>
        </div>

        <!-- Profile Info -->
        <div class="px-8 pb-6">
          <div class="flex items-end justify-between -mt-16">
            <!-- Profile Picture -->
            <div class="relative">
              <!-- <div class="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white"> -->
                {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
              <!-- </div> -->
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-3 mb-4">
              <button v-if="!isOwnProfile" class="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center space-x-2">
                <UserPlus class="w-4 h-4" />
                <span>إضافة صديق</span>
              </button>
              <button v-if="!isOwnProfile" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2">
                <MessageCircle class="w-4 h-4" />
                <span>مراسلة</span>
              </button>
              <button v-if="isOwnProfile" class="px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center space-x-2">
                <Settings class="w-4 h-4" />
                <span>تحرير الملف</span>
              </button>
              <button class="p-3 text-gray-400 hover:text-gray-600 transition-colors rounded-xl hover:bg-gray-100">
                <MoreHorizontal class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- User Details -->
          <div class="mt-4">
            <h1 class="text-3xl font-bold text-gray-900">{{ user?.name || 'مستخدم' }}</h1>
            <p class="text-gray-600 mt-2">مطور واجهات مستخدم | مهتم بـ Vue.js, Tailwind CSS</p>
            <p class="text-gray-500 text-sm mt-1 flex items-center space-x-2">
              <MapPin class="w-4 h-4" />
              <span>الرياض، السعودية</span>
            </p>

            <!-- Stats -->
            <div class="flex items-center space-x-6 mt-4 pt-4 border-t border-gray-100">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">1,245</div>
                <div class="text-sm text-gray-500">متابِع</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">856</div>
                <div class="text-sm text-gray-500">متابَع</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">324</div>
                <div class="text-sm text-gray-500">منشور</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Navigation Tabs -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div class="flex space-x-4 overflow-x-auto">
          <button 
            v-for="tab in profileTabs" 
            :key="tab.id"
            @click="activeProfileTab = tab.id"
            :class="activeProfileTab === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-gray-900'"
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
          <!-- Create Post (Only for own profile) -->
          <div v-if="isOwnProfile" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div class="flex space-x-4">
              <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
              </div>
              <textarea
                v-model="newPost"
                placeholder="شارك تحديثاً جديداً..."
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
                @click="createPost"
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

          <!-- User Posts -->
          <div v-for="post in userPosts" :key="post.id" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <!-- رأس المنشور -->
            <div class="p-6 flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 text-lg">{{ user?.name || 'مستخدم' }}</h3>
                  <p class="text-sm text-gray-500">
                    {{ formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) }}
                  </p>
                </div>
              </div>
              <button class="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal class="w-5 h-5" />
              </button>
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

          <!-- لا توجد منشورات -->
          <div v-if="userPosts.length === 0" class="text-center py-16">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                ?
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">لا توجد منشورات بعد</h3>
              <p class="text-gray-600 text-lg mb-6">لم يتم نشر أي محتوى حتى الآن.</p>
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
        <div v-if="activeProfileTab === 'about'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">معلومات عني</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">التعليم</h4>
                <p class="text-gray-600">بكالوريوس علوم الحاسب - جامعة الملك سعود</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">العمل</h4>
                <p class="text-gray-600">مطور واجهات أمامية في شركة التقنية</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">المكان</h4>
                <p class="text-gray-600 flex items-center space-x-2">
                  <MapPin class="w-4 h-4" />
                  <span>الرياض، السعودية</span>
                </p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">تاريخ الانضمام</h4>
                <p class="text-gray-600">يناير 2023</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">الاهتمامات</h4>
                <div class="flex flex-wrap gap-2">
                  <span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">Vue.js</span>
                  <span class="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">Tailwind CSS</span>
                  <span class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">UI/UX</span>
                  <span class="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">JavaScript</span>
                  <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">Web Development</span>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">اللغات</h4>
                <p class="text-gray-600">العربية (اللغة الأم), الإنجليزية (متقدم)</p>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">التواصل</h4>
                <div class="space-y-2">
                  <p class="text-gray-600">example@email.com</p>
                  <p class="text-gray-600">+966 55 123 4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Friends Tab -->
        <div v-if="activeProfileTab === 'friends'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">الأصدقاء</h3>
            <span class="text-gray-500">{{ friends.length }} صديق</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="friend in friends" :key="friend.id" class="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <div class="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                {{ friend.name.charAt(0) }}
              </div>
              <h4 class="font-semibold text-gray-900">{{ friend.name }}</h4>
              <p class="text-sm text-gray-500 mt-1">{{ friend.mutualFriends }} أصدقاء مشتركين</p>
              <div class="flex space-x-2 mt-3">
                <button class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                  عرض الملف
                </button>
                <button class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
                  <MessageCircle class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="activeProfileTab === 'photos'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">الصور</h3>
            <span class="text-gray-500">{{ photos.length }} صورة</span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="photo in photos" :key="photo.id" class="aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity group relative">
              <img :src="photo.url" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formatDistanceToNow } from 'date-fns'
import { 
  Camera, MapPin, UserPlus, MessageCircle, Settings, 
  MoreHorizontal, Image as ImageIcon, Video, Smile, 
  Share2, X, Heart, Users
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)
const profileUserId = computed(() => route.params.id)
const isOwnProfile = computed(() => !profileUserId.value || profileUserId.value === user.value?.id)

// Profile Tabs
const activeProfileTab = ref('posts')
const profileTabs = ref([
  { id: 'posts', name: 'المنشورات' },
  { id: 'about', name: 'معلومات' },
  { id: 'friends', name: 'الأصدقاء' },
  { id: 'photos', name: 'الصور' }
])

// Post functionality
const newPost = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)
const isPosting = ref(false)
const showEmojiPicker = ref(false)
const showComments = ref({})
const newComment = ref({})
const isCommenting = ref({})

// Sample data
const userPosts = ref([
  {
    id: 1,
    content: 'أعمل على مشروع جديد باستخدام Vue.js و Tailwind CSS. التجربة رائعة جداً!',
    image: null,
    likesCount: 24,
    commentsCount: 8,
    sharesCount: 3,
    isLiked: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    comments: [
      {
        id: 1,
        content: 'أتمنى لك التوفيق! يبدو مشروعاً رائعاً.',
        author: { name: 'أحمد علي' },
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 2,
    content: 'شاركت في مؤتمر تطوير الويب اليوم. تعلمت الكثير من التقنيات الجديدة!',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    likesCount: 45,
    commentsCount: 12,
    sharesCount: 7,
    isLiked: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    comments: []
  }
])

const friends = ref([
  { id: 1, name: 'أحمد علي', mutualFriends: 3 },
  { id: 2, name: 'فاطمة محمد', mutualFriends: 5 },
  { id: 3, name: 'خالد عبدالله', mutualFriends: 2 },
  { id: 4, name: 'نورة سعيد', mutualFriends: 7 },
  { id: 5, name: 'محمد حسن', mutualFriends: 4 },
  { id: 6, name: 'سارة عبدالرحمن', mutualFriends: 6 }
])

const photos = ref([
  { id: 1, url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' },
  { id: 2, url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' },
  { id: 3, url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' },
  { id: 4, url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' },
  { id: 5, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' },
  { id: 6, url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80' }
])

// Methods
const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => { imagePreview.value = e.target.result }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
}

const addEmoji = (emoji) => {
  newPost.value += emoji
  showEmojiPicker.value = false
}

const createPost = async () => {
  if (!newPost.value.trim() && !selectedImage.value) return
  isPosting.value = true

  // Simulate API call
  setTimeout(() => {
    userPosts.value.unshift({
      id: Date.now(),
      content: newPost.value,
      image: imagePreview.value,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      createdAt: new Date(),
      comments: []
    })
    
    newPost.value = ''
    selectedImage.value = null
    imagePreview.value = null
    isPosting.value = false
    toast.success('تم نشر المنشور بنجاح!')
  }, 1000)
}

const likePost = (postId) => {
  const post = userPosts.value.find(p => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likesCount += post.isLiked ? 1 : -1
  }
}

const toggleComments = (postId) => {
  showComments.value[postId] = !showComments.value[postId]
}

const addComment = async (postId) => {
  if (!newComment.value[postId]?.trim()) return
  isCommenting.value[postId] = true

  const post = userPosts.value.find(p => p.id === postId)
  if (post) {
    setTimeout(() => {
      post.comments.push({
        id: Date.now(),
        content: newComment.value[postId],
        author: { name: user.value?.name || 'مستخدم' },
        createdAt: new Date()
      })
      post.commentsCount++
      newComment.value[postId] = ''
      isCommenting.value[postId] = false
      toast.success('تم إضافة التعليق!')
    }, 500)
  }
}

const sharePost = (postId) => {
  const post = userPosts.value.find(p => p.id === postId)
  if (post) {
    post.sharesCount++
    toast.success('تم مشاركة المنشور!')
  }
}

onMounted(() => {
  // Fetch user profile data based on route params
  console.log('Profile user ID:', profileUserId.value)
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