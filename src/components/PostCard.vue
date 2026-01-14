<template>
    <div
        v-if="post.id != undefined"
        class="rounded-xl sm:rounded-2xl overflow-hidden transition-all hover:shadow-sm sm:hover:shadow-md bg-white dark:bg-gray-800 shadow-sm mx-2 sm:mx-0"
    >
        <!-- رأس المنشور - تحسين للهواتف -->
        <div
            class="p-4 sm:p-6 flex items-start sm:items-center justify-between"
        >
            <!-- معلومات المستخدم -->
            <div
                class="flex items-start sm:items-center space-x-3 sm:space-x-4"
            >
                <!-- صورة الملف الشخصي -->
                <div
                    v-on:click="goTo(`/profile/${user.id}`)"
                    class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-lg flex-shrink-0 cursor-pointer"
                >
                    {{ post.author.name.charAt(0) }}
                </div>

                <!-- معلومات الناشر والوقت -->
                <div class="min-w-0 flex-1">
                    <h3
                        class="font-semibold text-gray-900 text-base sm:text-lg dark:text-white truncate"
                    >
                        {{ post.author.name }}
                    </h3>
                    <p
                        class="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5"
                    >
                        <span class="inline-block">
                            {{
                                formatDistanceToNow(new Date(post.createdAt), {
                                    addSuffix: true,
                                })
                            }}
                        </span>
                        <span
                            class="hidden sm:inline-block w-1 h-1 bg-gray-400 rounded-full"
                        ></span>
                        <span class="flex items-center space-x-1">
                            <Users class="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>عام</span>
                        </span>
                    </p>
                </div>
            </div>

            <!-- أزرار الإجراءات -->
            <div class="flex items-center space-x-1 sm:space-x-2 ml-2">
                <button
                    @click="onSavePostClick(post.id)"
                    class="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                    :class="
                        post.isSaved
                            ? 'text-red-600'
                            : 'text-gray-600 hover:bg-gray-100'
                    "
                >
                    <Heart
                        class="w-4 h-4 sm:w-5 sm:h-5"
                        :class="{ 'fill-current': post.isSaved }"
                    />
                </button>
                <button
                    @click="toggleEditMenu(post.id)"
                    class="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <MoreHorizontal class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>

        <!-- قائمة التعديل (Dropdown) -->
        <div class="relative" v-if="editMenuVisible[post.id]">
            <div
                class="absolute right-3 sm:right-6 top-0 mt-1 w-36 sm:w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-50"
            >
                <button
                    @click="startEditPost(post.id)"
                    class="w-full text-right px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                    <span>تعديل</span>
                    <Edit class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                </button>
                <button
                    @click="confirmDeletePost(post.id)"
                    class="w-full text-right px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                    <span>حذف</span>
                    <Delete class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                </button>
                <button
                    v-if="!router.currentRoute.value.params.id"
                    @click="goTo(`home/${post.id}`)"
                    class="w-full text-right px-3 sm:px-4 py-2 text-xs sm:text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                    <span>عرض</span>
                    <Tv class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                </button>
            </div>
        </div>

        <!-- محتوى المنشور -->
        <div class="px-4 sm:px-6 pb-3 sm:pb-4">
            <!-- وضع التعديل -->
            <div v-if="editingPost[post.id]">
                <textarea
                    v-model="editedContent[post.id]"
                    class="w-full resize-none outline-none text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl px-4 py-3 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                    rows="3"
                ></textarea>
                <div class="flex justify-end space-x-2 mt-3">
                    <button
                        @click="cancelEditPost(post.id)"
                        class="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-500 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-gray-600 transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        @click="saveEditPost(post.id)"
                        class="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium hover:bg-blue-700 transition-all"
                    >
                        حفظ
                    </button>
                </div>
            </div>

            <!-- محتوى عادي -->
            <p
                v-else
                class="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm sm:text-lg leading-relaxed"
            >
                {{ post.content }}
            </p>
        </div>

        <!-- صورة المنشور -->
        <div v-if="post.image" class="px-0 sm:px-6 pb-4 sm:pb-6">
            <img
                :src="post.image"
                class="w-full max-h-64 sm:max-h-96 object-cover"
            />
        </div>

        <!-- فيديو المنشور -->
        <div v-if="post.video" class="px-0 sm:px-6 pb-4 sm:pb-6">
            <video
                :src="post.video"
                controls
                class="w-full max-h-64 sm:max-h-96 object-cover rounded-none sm:rounded-xl shadow-md"
            ></video>
        </div>

        <!-- إحصائيات المنشور -->
        <div
            class="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-gray-700"
        >
            <div
                class="flex items-center justify-between text-xs sm:text-sm text-gray-500"
            >
                <div
                    class="flex items-center space-x-3 sm:space-x-4 overflow-x-auto"
                >
                    <span class="flex items-center space-x-1 whitespace-nowrap">
                        <Heart class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                        <span>{{ post.likesCount }} إعجاب</span>
                    </span>
                    <span class="flex items-center space-x-1 whitespace-nowrap">
                        <MessageCircle
                            class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500"
                        />
                        <span>{{ post.commentsCount }} تعليق</span>
                    </span>
                    <span class="flex items-center space-x-1 whitespace-nowrap">
                        <Share2
                            class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500"
                        />
                        <span>{{ post.sharesCount }} مشاركة</span>
                    </span>
                </div>
            </div>
        </div>

        <!-- أزرار التفاعل -->
        <div
            class="px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-1 sm:gap-2"
        >
            <button
                @click="likePost(post.id)"
                class="flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all font-medium text-xs sm:text-sm"
                :class="
                    post.isLiked
                        ? 'text-red-600 bg-red-50 dark:bg-red-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                "
            >
                <Heart
                    :class="{ 'fill-current': post.isLiked }"
                    class="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span>إعجاب</span>
            </button>
            <button
                @click="toggleComments(post.id)"
                class="flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 rounded-lg sm:rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium text-xs sm:text-sm"
            >
                <MessageCircle class="w-4 h-4 sm:w-5 sm:h-5" />
                <span>تعليق</span>
            </button>
            <button
                @click="sharePost(post.id)"
                class="flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-3 rounded-lg sm:rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all font-medium text-xs sm:text-sm"
            >
                <Share2 class="w-4 h-4 sm:w-5 sm:h-5" />
                <span>مشاركة</span>
            </button>
        </div>

        <!-- قسم التعليقات -->
        <transition name="slide">
            <div
                v-if="showComments[post.id]"
                class="border-t border-gray-100 dark:border-gray-700 p-4 sm:p-6 space-y-3 sm:space-y-4"
            >
                <!-- تعليقات موجودة -->
                <div
                    v-for="comment in post.comments"
                    :key="comment.id"
                    class="flex space-x-2 sm:space-x-3"
                >
                    <div
                        class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
                    >
                        {{ comment.author.name.charAt(0) }}
                    </div>
                    <div v-if="comment.id != undefined" class="flex-1 min-w-0">
                        <div
                            class="bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3"
                        >
                            <h4
                                class="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm"
                            >
                                {{ comment.author.name }}
                            </h4>
                            <p
                                class="text-gray-700 dark:text-gray-300 mt-1 text-sm"
                            >
                                {{ comment.content }}
                            </p>
                        </div>
                        <div
                            class="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 text-xs text-gray-500"
                        >
                            <span class="text-xs">
                                {{
                                    formatDistanceToNow(
                                        new Date(comment.createdAt),
                                        {
                                            addSuffix: true,
                                        },
                                    )
                                }}
                            </span>
                            <button
                                v-if="comment.author.id == user.id"
                                @click="deleteComment(post.id, comment.id)"
                                class="hover:text-red-400 text-red-600 dark:text-red-400"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                </div>

                <!-- إضافة تعليق جديد -->
                <div class="flex space-x-2 sm:space-x-3">
                    <div
                        class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0"
                    >
                        {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
                    </div>
                    <div class="flex-1">
                        <textarea
                            v-model="newComment[post.id]"
                            placeholder="اكتب تعليقاً..."
                            class="w-full resize-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-h-[50px] sm:min-h-[60px] text-sm focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                            rows="1"
                        ></textarea>
                        <div class="flex justify-end mt-2">
                            <button
                                @click="addComment(post.id, user)"
                                :disabled="
                                    isCommenting[post.id] ||
                                    !newComment[post.id]?.trim()
                                "
                                class="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium disabled:opacity-50 hover:bg-blue-700 transition-all"
                            >
                                {{
                                    isCommenting[post.id]
                                        ? 'جاري الإرسال...'
                                        : 'تعليق'
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

    <!-- حالة المنشور غير موجود -->
    <div
        v-else
        class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-sm sm:hover:shadow-md mx-2 sm:mx-0"
    >
        <div class="p-4 sm:p-6">
            <p
                class="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-lg text-center"
            >
                هذا المنشور غير موجود
            </p>
        </div>
    </div>
</template>

<style scoped>
/* تأثيرات انتقالية للتعليقات */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.3s ease;
    max-height: 1000px;
    overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}

/* تحسينات للهواتف */
@media (max-width: 640px) {
    .truncate {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* مساحة أكبر للأزرار للضغط */
    button {
        min-height: 44px;
    }

    /* تحسين المسافات */
    .space-y-3 > * + * {
        margin-top: 0.75rem;
    }
}

/* تحسين عرض الصور والفيديوهات على الهاتف */
img,
video {
    max-width: 100%;
    height: auto;
}

/* تحسين النصوص على الشاشات الصغيرة */
@media (max-width: 480px) {
    .text-base {
        font-size: 0.9375rem;
    }

    .text-sm {
        font-size: 0.8125rem;
    }

    .text-xs {
        font-size: 0.75rem;
    }
}
</style>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { formatDistanceToNow } from 'date-fns'
import {
    Delete,
    Edit,
    Users,
    Heart,
    Share2,
    MoreHorizontal,
    MessageCircle,
    Tv,
} from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useInfiniteScroll } from '@vueuse/core'

const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()
const toast = useToast()

const user = computed(() => authStore.user)

// === حالة المنشور الجديد ===

const showComments = ref({})
const newComment = ref({})
const isCommenting = ref({})
const editMenuVisible = ref({})
const editingPost = ref({})
const editedContent = ref({})
// === تحميل المنشورات ===
const feedEl = ref(null)
// onMounted(async () => {
//     authStore.initialize()
// })
defineProps({ post: Object })
useInfiniteScroll(
    feedEl,
    async () => {
        if (postStore.hasMore) await postStore.fetchPosts()
    },
    { distance: 500 },
)

// === الإعجاب ===
const likePost = async postId => {
    try {
        await postStore.likePost(postId)
    } catch {
        toast.error('فشل في تسجيل الإعجاب')
    }
}

const toggleEditMenu = postId => {
    editMenuVisible.value[postId] = !editMenuVisible.value[postId]
}

const startEditPost = postId => {
    const post = postStore.posts.find(p => p.id === postId)
    if (post) {
        editingPost.value[postId] = true
        editedContent.value[postId] = post.content
        editMenuVisible.value[postId] = false
    }
}

const confirmDeletePost = postId => {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
        postStore.deletePost(postId)
        toast.success('تم حذف المنشور')
    }
    editMenuVisible.value[postId] = false
}

const cancelEditPost = postId => {
    editingPost.value[postId] = false
    editedContent.value[postId] = ''
}

const saveEditPost = async postId => {
    if (!editedContent.value[postId]?.trim()) return
    try {
        await postStore.editPost(postId, editedContent.value[postId])
        editingPost.value[postId] = false
        editedContent.value[postId] = ''
        toast.success('تم تحديث المنشور')
    } catch {
        toast.error('فشل في تحديث المنشور')
    }
}

const toggleComments = async postId => {
    showComments.value[postId] = !showComments.value[postId] // return true or false
    if (showComments.value[postId] == false) return

    await postStore.fetchComments(postId)
}

const addComment = async (postId, user) => {
    if (!newComment.value[postId]?.trim()) return
    isCommenting.value[postId] = true

    try {
        await postStore.addComment(postId, newComment.value[postId], user)
        newComment.value[postId] = ''
        toast.success('تم إضافة التعليق')
    } catch {
        toast.error('فشل في إضافة التعليق')
    } finally {
        isCommenting.value[postId] = false
    }
}

const onSavePostClick = postId => {
    postStore.savePost(postId)
}

const sharePost = postId => {
    postStore.sharePost(postId)
    toast.success('تم مشاركة المنشور')
}
const deleteComment = (postId, commentId) => {
    postStore.deleteComment(postId, commentId)
}
const goTo = path => {
    router.push(path)
}
</script>
