<template>
    <main
        class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="h-full" ref="feedEl">
            <div class="max-w-4xl mx-auto p-6 space-y-6">
                <!-- Header -->
                <div class="mb-8">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4">
                            <button
                                @click="markAllAsRead"
                                class="flex items-center space-x-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm hover:shadow"
                            >
                                <CheckCircle class="w-4 h-4" />
                                <span class="text-sm font-medium"
                                    >Mark all read</span
                                >
                            </button>
                            <button
                                @click="deleteAllNotification"
                                class="flex items-center space-x-2 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-sm hover:shadow"
                            >
                                <CheckCircle class="w-4 h-4" />
                                <span class="text-sm font-medium"
                                    >delete all</span
                                >
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="space-y-3">
                    <div
                        v-for="notification in notificationsStore.notifications"
                        :key="notification.id"
                        @click="handleNotificationClick(notification)"
                        :class="[
                            'group relative bg-gradient-to-br rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm',
                            notification.unread
                                ? 'border-blue-100 shadow-lg shadow-blue-100/30'
                                : 'border-gray-200/50 hover:shadow-xl  bg-gray-100',
                            notification.priority === 'high'
                                ? 'ring-1 ring-red-100'
                                : '',
                        ]"
                    >
                        <!-- Priority Badge -->
                        <div
                            v-if="notification.priority === 'high'"
                            class="absolute top-3 right-3"
                        >
                            <div
                                class="flex items-center space-x-1 px-2 py-1 bg-red-500/10 text-red-600 rounded-full"
                            >
                                <Zap class="w-3 h-3" />
                                <span class="text-xs font-semibold">High</span>
                            </div>
                        </div>

                        <div class="p-5">
                            <div class="flex items-start space-x-4">
                                <!-- Animated Icon -->
                                <div class="relative">
                                    <div
                                        :class="[
                                            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300',
                                            getIconBgClass(notification.type),
                                        ]"
                                    >
                                        <component
                                            :is="getIcon(notification.type)"
                                            class="w-6 h-6 text-white"
                                        />
                                    </div>
                                    <!-- Pulsing effect for unread -->
                                    <div
                                        v-if="notification.unread"
                                        :class="[
                                            'absolute inset-0 rounded-xl animate-pulse',
                                            getIconBgClass(notification.type) +
                                                '/30',
                                        ]"
                                    ></div>
                                </div>

                                <!-- Content -->
                                <div class="flex-1 min-w-0">
                                    <div
                                        class="flex items-start justify-between"
                                    >
                                        <div class="space-y-2">
                                            <div
                                                class="flex items-center space-x-2"
                                            >
                                                <h4
                                                    class="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300"
                                                >
                                                    {{ notification.title }}
                                                </h4>
                                                <span
                                                    v-if="notification.category"
                                                    class="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                                                >
                                                    {{ notification.category }}
                                                </span>
                                            </div>
                                            <p
                                                class="text-gray-600 leading-relaxed text-sm group-hover:text-gray-900 transition-colors duration-300"
                                            >
                                                {{ notification.message }}
                                            </p>
                                        </div>
                                        <div
                                            class="flex flex-col items-end space-y-2"
                                        >
                                            <span
                                                class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap"
                                            >
                                                {{
                                                    formatTime(
                                                        notification.timestamp,
                                                    )
                                                }}
                                            </span>
                                            <div
                                                class="flex items-center space-x-2"
                                            >
                                                <button
                                                    @click.stop="
                                                        deleteNotification(
                                                            notification.id,
                                                        )
                                                    "
                                                    class="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transform hover:scale-110 transition-all duration-200"
                                                >
                                                    <X class="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Actions & Meta -->
                                    <div
                                        class="mt-4 pt-4 border-t border-gray-100"
                                    >
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <!-- Quick Actions -->
                                            <div
                                                v-if="notification.actions"
                                                class="flex items-center space-x-2"
                                            >
                                            </div>

                                            <!-- Meta Info -->
                                            <div
                                                class="flex items-center space-x-3 text-gray-500"
                                            >
                                                <div
                                                    v-if="notification.sender"
                                                    class="flex items-center space-x-1 text-sm"
                                                >
                                                    <User class="w-3.5 h-3.5" />
                                                    <span>{{
                                                        notification.sender
                                                    }}</span>
                                                </div>
                                                <div
                                                    v-if="
                                                        notification.attachments
                                                    "
                                                    class="flex items-center space-x-1 text-sm"
                                                >
                                                    <Paperclip
                                                        class="w-3.5 h-3.5"
                                                    />
                                                    <span>{{
                                                        notification.attachments
                                                    }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Hover Effects -->
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        ></div>
                    </div>
                </div>

                <!-- Empty State -->
                <div
                    v-if="filteredNotifications.length === 0"
                    class="text-center py-16"
                >
                    <div
                        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6"
                    >
                        <BellOff class="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">
                        No notifications found
                    </h3>
                    <p class="text-gray-500 max-w-md mx-auto">
                        {{
                            searchQuery
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : 'All caught up! You have no notifications at the moment.'
                        }}
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import {
    Bell,
    BellOff,
    X,
    Check,
    MessageSquare,
    ShieldAlert,
    Download,
    Users,
    CheckCircle,
    Zap,
} from 'lucide-vue-next'
import { useNotificationsStore } from '@/stores/notifacation.store'

const notificationsStore = useNotificationsStore()
const router = useRouter()
const toast = useToast()

// Data
const notifications = computed(() => notificationsStore.notifications)
const searchQuery = ref('')
const showFilterMenu = ref(false)
const activeFilters = ref({
    type: [], // ❌ لا تضع all هنا
    status: {
        unread: false,
        read: false,
    },
})

// Notification types with icons
// const notificationTypes = [
//     { value: 'all', label: 'All', icon: Bell },
//     { value: 'message', label: 'Messages', icon: MessageSquare },
//     { value: 'security', label: 'Security', icon: ShieldAlert },
//     { value: 'update', label: 'Updates', icon: Download },
//     { value: 'social', label: 'Social', icon: Users },
//     { value: 'system', label: 'System', icon: Zap },
// ]

// إضافة الأيقونات الجديدة
import { User, Paperclip } from 'lucide-vue-next'

// تحديث البيانات النموذجية

// دالة الحذف
const deleteNotification = async id => {
    // notifications.value = notifications.value.filter(n => n.id !== id)
    await notificationsStore.deleteNotification(id)
    toast.success('Notification deleted')
}
const deleteAllNotification = async () => {
    await notificationsStore.deleteAllNotifications()
    toast.success('All notifications deleted')
}

// دالة الأيقونات

// دالة ألوان الخلفية

// Computed properties
const filteredNotifications = computed(() => {
    let filtered = notifications.value

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            n =>
                n.title.toLowerCase().includes(query) ||
                n.message.toLowerCase().includes(query),
        )
    }

    // Type filter
    if (
        activeFilters.value.type.length > 0 &&
        !activeFilters.value.type.includes('all')
    ) {
        filtered = filtered.filter(n =>
            activeFilters.value.type.includes(n.type),
        )
    }

    // Status filter
    if (activeFilters.value.status.unread || activeFilters.value.status.read) {
        filtered = filtered.filter(n => {
            if (
                activeFilters.value.status.unread &&
                !activeFilters.value.status.read
            ) {
                return n.unread
            }
            if (
                !activeFilters.value.status.unread &&
                activeFilters.value.status.read
            ) {
                return !n.unread
            }
            return true
        })
    }

    return filtered
})

// Methods
const getIcon = type => {
    const icons = {
        message: MessageSquare,
        security: ShieldAlert,
        update: Download,
        social: Users,
        system: Zap,
    }
    return icons[type] || Bell
}

const getIconBgClass = type => {
    const classes = {
        message: 'bg-blue-500',
        security: 'bg-red-500',
        update: 'bg-purple-500',
        social: 'bg-green-500',
        system: 'bg-amber-500',
    }
    return classes[type] || 'bg-gray-500'
}

const formatTime = timestamp => {
    const now = new Date()
    const diff = now - timestamp

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    if (diff < minute) {
        return 'Just now'
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute)
        return `${minutes}m ago`
    } else if (diff < day) {
        const hours = Math.floor(diff / hour)
        return `${hours}h ago`
    } else {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }
}

const handleNotificationClick = notification => {
    if (notification.unread) {
        notification.unread = false
        toast.success('Marked as read')
    }

    // Navigate based on type
    switch (notification.type) {
        case 'message':
            router.push('/messages')
            break
        case 'security':
            router.push('/security')
            break
        default:
        // Do nothing
    }
}

const toggleNotificationRead = notification => {
    notification.unread = !notification.unread
    toast.info(notification.unread ? 'Marked as unread' : 'Marked as read')
}

const handleAction = (notification, action) => {
    toast.success(`Action: ${action.label}`)

    switch (action.action) {
        case 'reply':
            router.push('/messages/compose')
            break
        case 'review':
            router.push('/security/logs')
            break
        case 'update':
            window.location.reload()
            break
    }
}

const markAllAsRead = () => {
    notifications.value.forEach(n => (n.unread = false))
    toast.success('All notifications marked as read')
}

// Close filter menu when clicking outside
onMounted(async () => {
    document.addEventListener('click', () => {
        showFilterMenu.value = false
    })
    await notificationsStore.fetchNotifications()
    // Load data
})

// Watch for search changes
watch(searchQuery, () => {
    // Reset to first page if implementing pagination
})
</script>

<style scoped>
/* Custom scrollbar */
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
</style>
