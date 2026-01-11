<template>
    <main
        class="flex-1 rounded-lg p-4 overflow-y-auto bg-white transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="h-full" ref="feedEl">
            <div class="max-w-4xl mx-auto p-2 space-y-6">
                <!-- add post and edit post -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-4 transition-colors"
                >
                    <div class="flex space-x-4">
                        <textarea
                            v-model="newPost"
                            placeholder="post now !"
                            class="flex-1 resize-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg bg-gray-50 dark:bg-gray-700/50 rounded-2xl px-4 py-3 min-h-[120px] focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
                            rows="4"
                        ></textarea>
                    </div>

                    <!-- Image Preview -->
                    <div v-if="imagePreview" class="relative">
                        <img
                            :src="imagePreview"
                            class="rounded-xl max-h-96 w-full object-cover shadow-md"
                        />
                        <button
                            @click="removeImage"
                            class="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                        >
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Video Preview -->
                    <div v-if="videoPreview" class="relative">
                        <video
                            :src="videoPreview"
                            controls
                            class="rounded-xl max-h-96 w-full object-cover shadow-md"
                        ></video>
                        <button
                            @click="removeVideo"
                            class="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all"
                        >
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Tools -->
                    <div
                        class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700"
                    >
                        <div class="flex items-center space-x-2">
                            <!-- Image -->
                            <label
                                class="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                <ImageIcon class="w-6 h-6" />
                                <span class="text-sm font-medium">image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    @change="handleImageChange"
                                    class="hidden"
                                />
                            </label>

                            <!-- Video -->
                            <label
                                class="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                            >
                                <Video class="w-6 h-6" />
                                <span class="text-sm font-medium">video</span>
                                <input
                                    type="file"
                                    accept="video/*"
                                    @change="handleVideoChange"
                                    class="hidden"
                                />
                            </label>

                            <!-- Emoji -->
                            <button
                                @click="showEmojiPicker = !showEmojiPicker"
                                class="flex items-center space-x-2 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                            >
                                <Smile class="w-6 h-6" />
                                <span class="text-sm font-medium">emoji</span>
                            </button>
                        </div>

                        <!-- Publish -->
                        <button
                            @click="addPost"
                            :disabled="
                                isPosting ||
                                (!newPost.trim() &&
                                    !selectedImage &&
                                    !selectedVideo)
                            "
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            <span>{{
                                isPosting ? 'جاري النشر...' : 'نشر'
                            }}</span>
                            <Share2 v-if="!isPosting" class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Emoji Picker -->
                    <div
                        v-if="showEmojiPicker"
                        class="border-t border-gray-100 dark:border-gray-700 pt-4"
                    >
                        <div class="flex flex-wrap gap-2">
                            <button
                                v-for="emoji in [
                                    '😊',
                                    '😂',
                                    '❤️',
                                    '🔥',
                                    '👍',
                                    '🎉',
                                    '👏',
                                    '🙏',
                                ]"
                                :key="emoji"
                                @click="addEmoji(emoji)"
                                class="text-2xl p-2 rounded-lg hover:scale-110 transition-transform hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {{ emoji }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- المنشورات -->
                <div
                    v-for="post in postStore.posts"
                    :key="post.id"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                >
                    <PostCard :post="post" />
                </div>

                <!-- تحميل -->
                <div v-if="isLoading" class="text-center py-12">
                    <div class="inline-flex items-center space-x-3">
                        <div
                            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                        ></div>
                        <span class="text-gray-600"
                            >جاري تحميل المزيد من المنشورات...</span
                        >
                    </div>
                </div>
                <div
                    v-if="!postStore.hasMore && postStore.posts.length > 0"
                    class="text-center py-12"
                >
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                    >
                        <div
                            class="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4"
                        >
                            ✓
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">
                            وصلت إلى النهاية!
                        </h3>
                        <p class="text-gray-600">
                            لقد شاهدت كل المنشورات المتاحة حالياً.
                        </p>
                    </div>
                </div>
                <!-- لا توجد منشورات -->
                <div
                    v-if="postStore.posts.length === 0 && !isLoading"
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
                            كن أول من ينشر محتوى رائع في مجتمعنا!
                        </p>
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
import { Share2, Image as ImageIcon, X, Video, Smile } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useInfiniteScroll } from '@vueuse/core'
import PostCard from '@/components/PostCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()
const toast = useToast()

const user = computed(() => authStore.user)

// === حالة المنشور الجديد ===
const newPost = ref('')
const selectedImage = ref(null)
const imagePreview = ref(null)
const selectedVideo = ref(null)
const videoPreview = ref(null)
const isPosting = ref(false)
const showEmojiPicker = ref(false)
// === تحميل المنشورات ===
const feedEl = ref(null)
onMounted(async () => {
    authStore.initialize()
    await postStore.fetchPosts()
})

useInfiniteScroll(
    feedEl,
    async () => {
        if (postStore.hasMore) await postStore.fetchPosts()
    },
    { distance: 500 },
)

// === إنشاء منشور ===

const addPost = async () => {
    if (!newPost.value.trim() && !selectedImage.value && !selectedVideo.value)
        return
    isPosting.value = true

    const formData = new FormData()
    formData.append('content', newPost.value)
    if (selectedImage.value) formData.append('image', selectedImage.value)
    if (selectedVideo.value) formData.append('video', selectedVideo.value)

    try {
        await postStore.createPost(formData, user.value)
        newPost.value = ''
        selectedImage.value = null
        imagePreview.value = null
        selectedVideo.value = null
        videoPreview.value = null
        showEmojiPicker.value = false
        toast.success('posting successfully')
    } catch (err) {
        toast.error(err.response?.data?.message || 'posting field')
    } finally {
        isPosting.value = false
    }
}
// === حالة التحميل ===
const isLoading = computed(() => postStore.loading)

// === وظائف إضافية ===
const handleImageChange = event => {
    const file = event.target.files[0]
    if (file) {
        selectedImage.value = file
        const reader = new FileReader()
        reader.onload = e => {
            imagePreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const removeImage = () => {
    selectedImage.value = null
    imagePreview.value = null
}

const handleVideoChange = event => {
    const file = event.target.files[0]
    if (file) {
        selectedVideo.value = file
        const reader = new FileReader()
        reader.onload = e => {
            videoPreview.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const removeVideo = () => {
    selectedVideo.value = null
    videoPreview.value = null
}

const addEmoji = emoji => {
    newPost.value += emoji
}

const goTo = path => {
    router.push(path)
}
</script>
