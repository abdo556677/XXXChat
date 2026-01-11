<template>
    <div
        v-if="post.id != undefined"
        class="rounded-2xl overflow-hidden transition-all hover:shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
    >
        <!-- رأس المنشور -->
        <div class="p-6 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div
                    v-on:click="goTo(`/profile/${user.id}`)"
                    class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg"
                >
                    {{ post.author.name.charAt(0) }}
                </div>
                <div>
                    <h3
                        class="font-semibold text-gray-900 text-lg dark:text-white"
                    >
                        {{ post.author.name }}
                    </h3>
                    <p
                        class="text-sm text-gray-500 flex items-center space-x-2"
                    >
                        <span>{{
                            formatDistanceToNow(new Date(post.createdAt), {
                                addSuffix: true,
                            })
                        }}</span>
                        <span class="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span class="flex items-center space-x-1">
                            <Users class="w-4 h-4" />
                            <span>عام</span>
                        </span>
                    </p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button
                    @click="onSavePostClick(post.id)"
                    class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                    :class="
                        post.isSaved
                            ? 'text-red-600'
                            : 'text-gray-600 hover:bg-gray-100'
                    "
                >
                    <Heart
                        class="w-5 h-5"
                        :class="{ 'fill-current': post.isSaved }"
                    />
                </button>
                <button
                    @click="toggleEditMenu(post.id)"
                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <MoreHorizontal class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- محتوى المنشور -->
        <div class="px-6 pb-4 relative">
            <div
                v-if="editMenuVisible[post.id]"
                class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
            >
                <button
                    @click="startEditPost(post.id)"
                    class="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
                >
                    <span>Edit Post</span>
                    <Edit class="w-4 h-4 text-gray-500" />
                </button>
                <button
                    @click="confirmDeletePost(post.id)"
                    class="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center justify-between"
                >
                    <span>remove Post</span>
                    <Delete class="w-4 h-4 text-red-500" />
                </button>
                <button
                    v-if="!router.currentRoute.value.params.id"
                    @click="goTo(`home/${post.id}`)"
                    class="w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 flex items-center justify-between"
                >
                    <span>show Post</span>
                    <Tv class="w-4 h-4 blue-red-500" />
                </button>
            </div>
            <div v-if="editingPost[post.id]">
                <textarea
                    v-model="editedContent[post.id]"
                    class="w-full resize-none outline-none text-gray-800 bg-gray-50 rounded-2xl px-4 py-3 min-h-[120px] focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                    rows="4"
                ></textarea>
                <div class="flex justify-end space-x-2 mt-2">
                    <button
                        @click="cancelEditPost(post.id)"
                        class="px-4 py-2 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all"
                    >
                        إلغاء
                    </button>
                    <button
                        @click="saveEditPost(post.id)"
                        class="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
                    >
                        حفظ
                    </button>
                </div>
            </div>
            <p
                v-else
                class="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed"
            >
                {{ post.content }}
            </p>
        </div>

        <!-- صورة المنشور -->

        <div v-if="post.image" class="px-6 pb-6">
            <img
                :src="post.image"
                class="rounded-xl w-full max-h-96 object-cover shadow-md"
            />
        </div>

        <!-- فيديو المنشور -->
        <div v-if="post.video" class="px-6 pb-6">
            <video
                :src="post.video"
                controls
                class="rounded-xl w-full max-h-96 object-cover shadow-md"
            ></video>
        </div>

        <!-- إحصائيات المنشور -->
        <div class="px-6 py-4 border-t border-gray-100">
            <div
                class="flex items-center justify-between text-sm text-gray-500"
            >
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
                :class="
                    post.isLiked
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-600 hover:bg-gray-100'
                "
            >
                <Heart
                    :class="{ 'fill-current': post.isLiked }"
                    class="w-5 h-5"
                />
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
        <div
            v-if="showComments[post.id]"
            class="border-t border-gray-100 p-6 space-y-4"
        >
            <!-- تعليقات موجودة -->
            <div
                v-for="comment in post.comments"
                :key="comment.id"
                class="flex space-x-3"
            >
                <div
                    class="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                    <!-- {{ comment.author.name }} -->
                </div>
                <div v-if="comment.id != undefined" class="flex-1">
                    <div class="bg-gray-50 rounded-2xl px-4 py-3">
                        <h4 class="font-semibold text-gray-900 text-sm">
                            {{ comment.author.name }}
                        </h4>
                        <p class="text-gray-700 mt-1">{{ comment.content }}</p>
                    </div>
                    <div
                        class="flex items-center space-x-4 mt-2 text-xs text-gray-500"
                    >
                        <span>{{
                            formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                            })
                        }}</span>
                        <!-- <button class="hover:text-blue-600">إعجاب</button>
                  <button class="hover:text-blue-600">رد</button> -->
                        <button
                            v-if="comment.author.id == user.id"
                            @click="deleteComment(post.id, comment.id)"
                            class="hover:text-red-400 text-red-700"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </div>

            <!-- إضافة تعليق جديد -->
            <div class="flex space-x-3">
                <div
                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
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
                            @click="addComment(post.id, user)"
                            :disabled="
                                isCommenting[post.id] ||
                                !newComment[post.id]?.trim()
                            "
                            class="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-blue-700 transition-all"
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
    </div>
    <div
        v-else
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
    >
        <div class="p-6 flex items-center justify-between">
            <p class="font-semibold text-gray-900 text-lg">
                this post is not exsist
            </p>
        </div>
    </div>
</template>
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
onMounted(async () => {
    authStore.initialize()
})
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
