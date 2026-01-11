<template>
    <main
        class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="h-full" ref="feedEl">
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- رأس الدردشة -->
                <div
                    class="p-2 border-b border-gray-200 flex items-center justify-between"
                    
                >
                    <!-- رأس نافذة المراسلة -->
                    <div class="flex items-center space-x-3 w-full " v-if="chatStore.currentChat.user">
                        <button
                            @click="goTo(`/chat`)"
                            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowRight class="w-5 h-5 text-gray-600" />
                        </button>

                        <div class="flex items-center space-x-3 flex-1">
                            <div class="relative">
                                <div
                                    class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold"
                                >
                                    {{
                                        chatStore.currentChat.user.username
                                            .charAt(0)
                                            .toUpperCase()
                                    }}
                                </div>
                                <div
                                    :class="[
                                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                                        chatStore.currentChat.user.isOnline
                                            ? 'bg-green-500'
                                            : 'bg-gray-400',
                                    ]"
                                ></div>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-900">
                                    {{ chatStore.currentChat.user.username }}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {{
                                        chatStore.currentChat.user.isOnline
                                            ? 'متصل الآن'
                                            : 'غير متصل'
                                    }}
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center space-x-2">
                            <button
                                class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                                <Video class="w-5 h-5" />
                            </button>
                            <button
                                class="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            >
                                <Phone class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- محتوى الدردشة -->
                <div class="flex-1 overflow-hidden">
                    <!-- حالة التحميل -->
                    <div
                        v-if="chatStore.loading"
                        class="h-full flex items-center justify-center"
                    >
                        <div class="flex space-x-2">
                            <div
                                class="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                            ></div>
                            <div
                                class="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                                style="animation-delay: 0.2s"
                            ></div>
                            <div
                                class="w-4 h-4 bg-blue-500 rounded-full animate-bounce"
                                style="animation-delay: 0.4s"
                            ></div>
                        </div>
                    </div>
                    <!-- حالة: عرض نافذة المراسلة -->
                    <div class="h-full flex flex-col" v-else>
                        <!-- منطقة الرسائل -->
                        <!-- منطقة الرسائل -->
                        <div
                            class="flex-1 overflow-y-auto space-y-4"
                            style="
                                max-height: calc(100vh - 16rem);
                                min-height: calc(100vh - 16rem);
                            "
                            ref="messagesContainer"
                        >
                            <!-- رسائل الدردشة -->
                            <div
                                v-for="message in chatStore.messages"
                                :key="message.id"
                                :class="[
                                    'flex p-2',
                                    message.sender.id === user.id
                                        ? 'justify-end'
                                        : 'justify-start',
                                ]"
                            >
                                <div
                                    :class="[
                                        'relative group max-w-xs lg:max-w-md rounded-2xl px-4 py-3',
                                        message.sender.id === user.id
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-none',
                                    ]"
                                >
                                    <!-- زر القائمة ⋮ -->
                                    <div
                                        v-if="message.sender.id === user.id"
                                        class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <button
                                            @click.stop="toggleMenu(message.id)"
                                            class="p-1 rounded hover:bg-black/20"
                                        >
                                            ⋮
                                        </button>

                                        <!-- Dropdown -->
                                        <div
                                            v-if="openMenuId === message.id"
                                            class="absolute right-0 mt-1 w-32 bg-gray-200 text-gray-800 rounded-lg shadow-lg z-50"
                                        >
                                            <button
                                                @click="editMessage(message)"
                                                class="w-full text-right px-3 py-2 hover:bg-gray-100"
                                            >
                                                تعديل
                                            </button>

                                            <button
                                                @click="
                                                    copyMessage(message.content)
                                                "
                                                class="w-full text-right px-3 py-2 hover:bg-gray-100"
                                            >
                                                 نسخ
                                            </button>

                                            <button
                                                @click="
                                                    deleteMessage(message.id)
                                                "
                                                class="w-full text-right px-3 py-2 text-red-600 hover:bg-red-50"
                                            >
                                                 حذف
                                            </button>
                                        </div>
                                    </div>

                                    <!-- محتوى الرسالة -->
                                    <p class="whitespace-pre-wrap mt-2">
                                        {{ message.content }}
                                    </p>

                                    <!-- الوقت + القراءة -->
                                    <div
                                        :class="[
                                            'text-xs mt-2 flex items-center space-x-2',
                                            message.sender.id === user.id
                                                ? 'text-blue-200'
                                                : 'text-gray-500',
                                        ]"
                                    >
                                        <span>{{
                                            formatMessageTime(message.createdAt)
                                        }}</span>

                                        <span
                                            v-if="message.sender.id === user.id"
                                        >
                                            <Check
                                                class="w-4 h-4"
                                                v-if="message.read"
                                            />
                                            <Check
                                                class="w-4 h-4 text-gray-300"
                                                v-else
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- إدخال الرسالة -->
                        <div class="p-2 border-t border-gray-200">
                            <div class="flex items-center space-x-3">
                                <button
                                    class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                >
                                    <Plus class="w-5 h-5" />
                                </button>
                                <div class="flex-1 relative">
                                    <textarea
                                        v-model="newMessage"
                                        @keydown.enter.prevent="sendMessage"
                                        placeholder="اكتب رسالة..."
                                        class="w-full pr-12 pl-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows="1"
                                        @input="handleTyping"
                                    ></textarea>
                                    <div
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                                    >
                                        <!-- <button
                        class="p-1 text-gray-400 hover:text-yellow-600"
                        >
                        <Smile class="w-5 h-5" />
                        </button>
                        <button
                        class="p-1 text-gray-400 hover:text-green-600"
                        >
                        <ImageIcon class="w-5 h-5" />
                        </button> -->
                                    </div>
                                </div>
                                <button
                                    @click="sendMessage"
                                    :disabled="!newMessage.trim()"
                                    class="p-3 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                >
                                    <Send class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { Plus, Video, Phone, Check, Send, ArrowRight } from 'lucide-vue-next'
import router from '@/router'
const chatStore = useChatStore()
const authStore = useAuthStore()
const toast = useToast()
const user = computed(() => authStore.user)

// === حالة الدردشة ===
const newMessage = ref('')
const messagesContainer = ref(null)
const openMenuId = ref(null)

const sendMessage = async () => {
    await chatStore.sendMessage(newMessage.value)

}

// === التعامل مع الكتابة ===
const handleTyping = () => {
    // إرسال إشعار الكتابة للخادم
    // chatApi.sendTyping(chatStore.currentChat.id)
}

const formatMessageTime = timestamp => {
    return new Date(timestamp).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

// === التمرير للأسفل ===
const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
}

// === مراقبة التغييرات في الرسائل ===
watch(
    () => chatStore.messages.length,
    async () => {
        await nextTick() // انتظر حتى يتم تحديث DOM
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop =
                messagesContainer.value.scrollHeight
        }
    },
)

// === تحميل الدردشات عند التحميل ===
onMounted(async () => {
    chatStore.fetchMessages(router.currentRoute.value.params.id)
})
const goTo = path => {
    router.push(path)
}
const toggleMenu = id => {
    openMenuId.value = openMenuId.value === id ? null : id
}

// نسخ
const copyMessage = async content => {
    await navigator.clipboard.writeText(content)
    toast.success('تم نسخ الرسالة')
    openMenuId.value = null
}

// تعديل
const editMessage = message => {
    toast.info('ميزة غير متاحة !')
    // newMessage.value = message.content
    // chatStore.setEditingMessage(message.id)
    // openMenuId.value = null
}

// حذف
const deleteMessage = async id => {
    if (!confirm('حذف الرسالة؟')) return
    await chatStore.deleteMessage(id)
    openMenuId.value = null
}
</script>

<style scoped>
/* تحسينات للتمرير */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
}

/* تحسينات للرسائل */
.animate-bounce {
    animation: bounce 1.4s infinite ease-in-out;
}

@keyframes bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-5px);
    }
}
</style>
