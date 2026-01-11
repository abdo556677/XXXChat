<!-- eslint-disable vue/valid-template-root -->

<template>
    <main
        class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="h-full" ref="feedEl">
            <div class="max-w-4xl mx-auto p-6 space-y-6">
                <div
                    class="p-4 border-b border-gray-200 flex items-center justify-between"
                >
                    <h2 class="text-xl font-bold text-gray-900">الدردشات</h2>
                    <div class="flex items-center space-x-2">
                        <button
                            @click="toggleChatSearch"
                            class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Search class="w-5 h-5" />
                        </button>
                        <button
                            @click="startNewChat"
                            class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                            <Plus class="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div class="flex-1 overflow-hidden">
                    <!-- بحث الدردشات -->
                    <div
                        v-if="showChatSearch"
                        class="p-4 border-b border-gray-200"
                    >
                        <div class="relative">
                            <Search
                                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                            />
                            <input
                                v-model="chatSearch"
                                type="text"
                                placeholder="ابحث في الدردشات..."
                                class="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <!-- حالة التحميل -->
                    <div
                        v-if="chatStore.loading"
                        class="flex items-center justify-center p-8"
                    >
                        <div class="flex items-center space-x-2">
                            <div
                                class="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                            ></div>
                            <div
                                class="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                                style="animation-delay: 0.1s"
                            ></div>
                            <div
                                class="w-4 h-4 bg-blue-600 rounded-full animate-bounce"
                                style="animation-delay: 0.2s"
                            ></div>
                        </div>
                        <span class="text-gray-600 mr-3">جاري التحميل...</span>
                    </div>

                    <!-- حالة الخطأ -->
                    <div
                        v-else-if="error"
                        class="flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div
                            class="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-4"
                        >
                            <X class="w-10 h-10 text-red-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">
                            خطأ في تحميل الدردشات
                        </h3>
                        <p class="text-gray-600 mb-4">{{ error }}</p>
                        <button
                            @click="retryLoadChats"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            إعادة المحاولة
                        </button>
                    </div>

                    <!-- محادثة جديدة -->
                    <div
                        v-if="showNewChatModal"
                        class="p-4 border-b border-gray-200 bg-blue-50"
                    >
                        <div class="flex items-center space-x-3">
                            <button
                                @click="showNewChatModal = false"
                                class="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <X class="w-5 h-5 text-blue-600" />
                            </button>
                            <input
                                v-model="newChatSearch"
                                type="text"
                                placeholder="ابحث عن صديق للدردشة..."
                                class="flex-1 px-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                @input="searchUsersForChat"
                            />
                        </div>
                        <!-- نتائج البحث للمحادثة الجديدة -->
                        <div
                            v-if="chatStore.searchResults.length > 0"
                            class="mt-3 space-y-2"
                        >
                            <div
                                v-for="user in chatStore.searchResults"
                                :key="user.id"
                                @click="createNewChat(user)"
                                class="flex items-center space-x-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-colors"
                            >
                                <div
                                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold"
                                >
                                    {{ user.name.charAt(0).toUpperCase() }}
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-semibold text-gray-900">
                                        {{ user.name }}
                                    </h4>
                                    <p class="text-sm text-gray-500">
                                        {{ user.status || 'متصل' }}
                                    </p>
                                </div>
                                <Plus class="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <!-- قائمة الدردشات -->
                    <div class="h-full overflow-y-auto">
                        <div
                            v-if="filteredChats.length > 0"
                            class="divide-y divide-gray-100"
                        >
                            <div
                                v-for="chat in filteredChats"
                                :key="chat.id"
                                @click="goTo(`chat/${chat.id}`)"
                                class="relative group p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <!-- زر الحذف (يمين) -->
                                <button
                                    @click.stop="deleteChat(chat.id)"
                                    class="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition p-2 rounded-full hover:bg-red-100 text-red-600"
                                    title="حذف المحادثة"
                                >
                                    🗑️
                                </button>

                                <div class="flex items-center space-x-3">
                                    <!-- صورة المستخدم -->
                                    <div class="relative">
                                        <div
                                            :class="[
                                                'w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg',
                                                getRandomGradient(null) //chat.user.id,
                                            ]"
                                        >
                                            {{
                                                chat.user.username
                                                    .charAt(0)
                                                    .toUpperCase()
                                            }}
                                        </div>

                                        <div
                                            :class="[
                                                'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                                                chat.user.isOnline
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-400',
                                            ]"
                                        ></div>
                                    </div>

                                    <!-- معلومات الدردشة -->
                                    <div class="flex-1 min-w-0">
                                        <div
                                            class="flex justify-between items-center"
                                        >
                                            <h3
                                                class="font-semibold text-gray-900 truncate"
                                            >
                                                {{ chat.user.username }}
                                            </h3>

                                            <span class="text-xs text-gray-500">
                                                {{
                                                    chat.lastMessage
                                                        ? formatChatTime(
                                                              chat.lastMessage
                                                                  .createdAt,
                                                          )
                                                        : ''
                                                }}
                                            </span>
                                        </div>

                                        <p
                                            class="text-sm text-gray-600 truncate mt-1"
                                        >
                                            <template v-if="chat.lastMessage">
                                                <span
                                                    v-if="
                                                        chat.lastMessage
                                                            .senderId ===
                                                        user.id
                                                    "
                                                >
                                                    أنت:
                                                </span>
                                                {{ chat.lastMessage.content }}
                                            </template>

                                            <span
                                                v-else
                                                class="italic text-gray-400"
                                            >
                                                لا توجد رسائل بعد
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- لا توجد دردشات -->
                        <div
                            v-else
                            class="flex flex-col items-center justify-center h-full p-8 text-center"
                        >
                            <div
                                class="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4"
                            >
                                <MessageCircle
                                    class="w-10 h-10 text-blue-600"
                                />
                            </div>
                            <h3
                                class="text-lg font-semibold text-gray-900 mb-2"
                            >
                                لا توجد دردشات بعد
                            </h3>
                            <p class="text-gray-600 mb-4">
                                ابدأ محادثة جديدة مع أصدقائك
                            </p>
                            <button
                                @click="startNewChat"
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                ابدأ دردشة جديدة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { Search, Plus, X, MessageCircle } from 'lucide-vue-next'

const router = useRouter()
const chatStore = useChatStore()
const authStore = useAuthStore()
const toast = useToast()
const user = computed(() => authStore.user)

// === حالة الدردشة ===
const chats = ref([])
const selectedChat = ref(null)
const showChatSearch = ref(false)
const chatSearch = ref('')
const showNewChatModal = ref(false)
const newChatSearch = ref('')
const newChatResults = ref([])
const messagesContainer = ref(null)
const error = ref(null)
// const isLoading = computed(() => postStore.loading)
// === تصفية الدردشات ===
const filteredChats = computed(() => {
    if (!chatSearch.value.trim()) return chatStore.chats

    return chats.value.filter(
        chat =>
            chat.user.name
                .toLowerCase()
                .includes(chatSearch.value.toLowerCase()) ||
            chat.lastMessage.content
                .toLowerCase()
                .includes(chatSearch.value.toLowerCase()),
    )
})

// === اختيار دردشة ===
const selectChat = async chat => {
    await chatStore.fetchMessages(chat)

    selectChat.value = await chatStore.currentChat

    console.log(selectChat.value)
    // await chatStore.selectChat(chat)
    // selectedChat.value = chatStore.currentChat
    // console.log(selectChat.value,'ghg')
    // // تحديث الرسائل كمقروءة
    // if (chat.unreadCount > 0) {
    //   markChatAsRead(chat.id)
    // }
}

// === بدء دردشة جديدة ===
const startNewChat = () => {
    showNewChatModal.value = true
    newChatResults.value = []
}

// === البحث عن مستخدمين لدردشة جديدة ===
const searchUsersForChat = async () => {
    if (!newChatSearch.value.trim()) {
        newChatResults.value = []
        return
    }
    chatStore.searchUsers(newChatSearch.value)
}

// === إنشاء دردشة جديدة ===
const createNewChat = targetUser => {
    console.log('fdgdfgdgd')
    const existingChat = chats.value.find(
        chat => chat.user.id === targetUser.id,
    ) // authStore.selectChat()

    if (existingChat) {
        selectChat(existingChat)
    } else {
        const newChat = {
            id: Date.now(),
            user: targetUser,
            lastMessage: {
                content: 'بدأتم المحادثة',
                timestamp: new Date(),
                sender: user.value.id,
                read: true,
            },
            unreadCount: 0,
            messages: [],
            isTyping: false,
        }

        chats.value.unshift(newChat)
        selectChat(newChat)
    }

    showNewChatModal.value = false
    newChatSearch.value = ''
    newChatResults.value = []
}

// === تنسيق الوقت ===
const formatChatTime = timestamp => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInHours = (now - messageTime) / (1000 * 60 * 60)

    if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60)
        return `${minutes} د`
    } else if (diffInHours < 24) {
        return messageTime.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        })
    } else {
        return messageTime.toLocaleDateString('ar-EG', {
            month: 'short',
            day: 'numeric',
        })
    }
}

// === التمرير للأسفل ===
const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// === توليد ألوان متنوعة للصور ===
const getRandomGradient = id => {
    const gradients = [
        'bg-gradient-to-br from-purple-500 to-pink-500',
        'bg-gradient-to-br from-blue-500 to-cyan-500',
        'bg-gradient-to-br from-green-500 to-teal-500',
        'bg-gradient-to-br from-yellow-500 to-orange-500',
        'bg-gradient-to-br from-red-500 to-pink-500',
        'bg-gradient-to-br from-indigo-500 to-purple-500',
    ]

    return gradients[id % gradients.length]
}

// === مراقبة التغييرات في الرسائل ===
watch(
    () => selectedChat.value?.messages,
    () => {
        scrollToBottom()
    },
    { deep: true },
)

// === تحميل الدردشات عند التحميل ===
onMounted(async () => {
    try {
        error.value = null
        await chatStore.fetchChats()
        console.log(chats.value)
    } catch (err) {
        error.value = err.message || 'حدث خطأ في تحميل الدردشات'
        console.error('Failed to load chats:', err)
    }
})

// === إعادة تحميل الدردشات ===
const retryLoadChats = async () => {
    try {
        error.value = null
        await chatStore.fetchChats()
    } catch (err) {
        error.value = err.message || 'حدث خطأ في تحميل الدردشات'
        console.error('Failed to retry loading chats:', err)
    }
}

// === تبديل بحث الدردشات ===
const toggleChatSearch = () => {
    showChatSearch.value = !showChatSearch.value
    if (!showChatSearch.value) {
        chatSearch.value = ''
    }
}
const goTo = path => {
    router.push(path)
}
const openChatMenuId = ref(null)

const toggleChatMenu = chatId => {
    openChatMenuId.value = openChatMenuId.value === chatId ? null : chatId
}

const deleteChat = async chatId => {
    if (!confirm('هل أنت متأكد من حذف المحادثة؟')) return
    await chatStore.deleteChat(chatId)
    openChatMenuId.value = null
}

const pinChat = chatId => {
    chatStore.pinChat(chatId)
    openChatMenuId.value = null
}

const muteChat = chatId => {
    chatStore.muteChat(chatId)
    openChatMenuId.value = null
}

const archiveChat = chatId => {
    chatStore.archiveChat(chatId)
    openChatMenuId.value = null
}
</script>
