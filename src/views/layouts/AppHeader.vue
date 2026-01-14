<template>
<header
    class="px-4 border-b shadow-sm relative transition-all duration-300
           bg-gradient-to-br from-gray-50 to-white
           dark:from-zinc-900 dark:to-zinc-800
           border-gray-200 dark:border-zinc-700"
>
    <div class="max-w-7xl mx-auto h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
            <div
                @click="goTo('/home')"
                class="flex items-center space-x-2 cursor-pointer"
            >
                <div
                    class="w-10 h-10 rounded-full flex items-center justify-center
                           text-white font-bold text-lg shadow-lg
                           bg-gradient-to-br from-blue-600 to-indigo-700"
                >
                    X
                </div>
                <span
                    class="hidden sm:block font-bold text-xl
                           text-gray-900 dark:text-white"
                >
                    Chat
                </span>
            </div>
        </div>

        <!-- Search (desktop) -->
        <div class="hidden md:flex flex-1 max-w-2xl mx-8">
            <div class="relative w-full">
                <Search
                    class="absolute right-3 top-1/2 -translate-y-1/2
                           w-5 h-5 text-gray-400"
                />
                <input
                    v-model="searchQuery"
                    @input="handleSearchInput"
                    @keydown="handleKeyDown"
                    @focus="showSuggestions = true"
                    @blur="hideSuggestions"
                    type="text"
                    placeholder="search for any thing..."
                    class="w-full pr-10 pl-4 py-2 rounded-full text-sm
                           bg-gray-100 dark:bg-zinc-700
                           text-gray-900 dark:text-white
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500
                           focus:bg-white dark:focus:bg-zinc-800
                           transition-all"
                />

                <div
                    v-if="isSearching"
                    class="absolute left-3 top-1/2 -translate-y-1/2"
                >
                    <div
                        class="animate-spin rounded-full h-4 w-4
                               border-b-2 border-blue-600"
                    ></div>
                </div>

                <!-- Suggestions -->
                <transition name="fade">
                    <div
                        v-if="showSuggestions && searchSuggestions.length > 0"
                        class="absolute top-full mt-1 w-full z-50 max-h-60 overflow-y-auto
                               bg-white dark:bg-zinc-800
                               border border-gray-200 dark:border-zinc-700
                               rounded-lg shadow-lg"
                    >
                        <div class="py-2">
                            <div
                                class="px-3 py-2 text-xs font-medium
                                       text-gray-500 dark:text-gray-400
                                       border-b border-gray-100 dark:border-zinc-700"
                            >
                                بحث سابق
                            </div>
                            <button
                                v-for="(suggestion, index) in searchSuggestions"
                                :key="suggestion"
                                @mousedown="selectSuggestion(suggestion)"
                                :class="[
                                    'w-full text-right px-3 py-2 text-sm transition-colors',
                                    selectedSuggestionIndex === index
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700',
                                ]"
                            >
                                {{ suggestion }}
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Icons -->
        <div class="flex items-center relative">
            <button
                @click="toggleMobileSearch"
                class="md:hidden p-2 rounded-full
                       hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <Search class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <button
                @click="goTo('notifications')"
                class="p-2 rounded-full relative
                       hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <Bell class="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span
                    v-if="unreadNotifications > 0"
                    class="absolute top-1 right-1 w-2 h-2
                           bg-red-500 rounded-full animate-pulse"
                ></span>
            </button>

            <button
                @click="goTo('/chat')"
                class="p-2 rounded-full
                       hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <MessageCircle class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
                @click="goTo('/users')"
                class="p-2 rounded-full
                       hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <Users class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
                @click="goTo('/saved')"
                class="p-2 rounded-full
                       hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <Save class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
                @click="goTo('/home')"
                class="p-2 rounded-full
                       hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <House class="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <!-- Profile -->
            <div class="relative" ref="profileMenuRef">
                <div
                    @click="toggleProfileMenu"
                    class="w-10 h-10 rounded-full flex items-center justify-center
                           text-white font-bold cursor-pointer shadow-lg
                           bg-gradient-to-br from-purple-500 to-pink-500
                           hover:opacity-90 transition-opacity"
                >
                    {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
                </div>

                <!-- Dropdown -->
                <transition name="fade">
                    <div
                        v-if="showProfileMenu"
                        class="absolute right-0 mt-2 w-48 z-50
                               bg-white dark:bg-zinc-800
                               border border-gray-200 dark:border-zinc-700
                               rounded-lg shadow-lg py-2"
                    >
                        <button
                            @click="goTo('/profile')"
                            class="w-full text-right px-4 py-2 text-sm
                                   text-gray-700 dark:text-gray-200
                                   hover:bg-gray-100 dark:hover:bg-zinc-700
                                   flex items-center justify-between"
                        >
                            <span>profile</span>
                            <User class="w-4 h-4" />
                        </button>

                        <div class="border-t my-1 dark:border-zinc-700"></div>

                        <button
                            @click="toggleDarkMode"
                            class="w-full text-right px-4 py-2 text-sm
                                   text-gray-700 dark:text-gray-200
                                   hover:bg-gray-100 dark:hover:bg-zinc-700
                                   flex items-center justify-between"
                        >
                            <span>dark mode</span>
                            <Moon class="w-4 h-4" />
                        </button>

                        <button
                            @click="logout"
                            class="w-full text-right px-4 py-2 text-sm
                                   text-red-600 hover:bg-gray-100
                                   dark:hover:bg-zinc-700
                                   flex items-center justify-between"
                        >
                            <span>logout</span>
                            <LogOut class="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</header>

</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSearchStore } from '@/stores/search'
import { useToast } from 'vue-toastification'
import {
    User,
    Users,
    House,
    Bell,
    MessageCircle,
    Search,
    X,
    Moon,
    LogOut,
    User2,
    Save,
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const searchStore = useSearchStore()
const toast = useToast()

const user = computed(() => authStore.user)
const searchSuggestions = computed(() =>
    searchStore.getSuggestions(searchQuery.value),
)
const showProfileMenu = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
const showMobileSearch = ref(false)
const showSuggestions = ref(false)
const unreadNotifications = ref(3)
const mobileSearchInput = ref(null)
const searchInput = ref(null)
const profileMenuRef = ref(null)
const selectedSuggestionIndex = ref(-1)

// Navigation
const goTo = path => {
    router.push(path)
    showProfileMenu.value = false
}
// Search functions
const getSearchContext = () => {
    const currentPath = route.path
    if (currentPath.includes('/users')) return 'users'
    if (currentPath.includes('/home') || currentPath.includes('/profile'))
        return 'posts'
    return 'global'
}

const performSearch = async () => {
    if (!searchQuery.value.trim()) return
    isSearching.value = true
    try {
        const context = getSearchContext()
        router.push('/search')
        await searchStore.performSearch(searchQuery.value, context)

        // Add to search history
        searchStore.addToHistory(searchQuery.value)

        // if (context === 'global') {
        //     router.push('/search')
        // }
        
        showSuggestions.value = false
        toast.success(`نتائج البحث عن: ${searchQuery.value}`)
    } catch {
        toast.error('فشل في البحث')
    } finally {
        isSearching.value = false
    }
}

const toggleMobileSearch = () => {
    showMobileSearch.value = !showMobileSearch.value
    if (showMobileSearch.value) {
        nextTick(() => mobileSearchInput.value?.focus())
    }
}

const performMobileSearch = async () => {
    if (!searchQuery.value.trim()) return
    isSearching.value = true
    try {
        const context = getSearchContext()
        await searchStore.performSearch(searchQuery.value, context)

        if (context === 'global') {
            router.push('/search')
        }
        showMobileSearch.value = false
        toast.success(`نتائج البحث عن: ${searchQuery.value}`)
    } catch {
        toast.error('فشل في البحث')
    } finally {
        isSearching.value = false
    }
}

// Enhanced search functions with suggestions
const handleSearchInput = () => {
    if (searchQuery.value.trim()) {
        showSuggestions.value = true
        selectedSuggestionIndex.value = -1
    } else {
        showSuggestions.value = false
    }
}

const handleKeyDown = event => {
    if (!showSuggestions.value || searchSuggestions.value.length === 0) {
        if (event.key === 'Enter') {
            performSearch()
        }
        return
    }

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            selectedSuggestionIndex.value = Math.min(
                selectedSuggestionIndex.value + 1,
                searchSuggestions.value.length - 1,
            )
            break
        case 'ArrowUp':
            event.preventDefault()
            selectedSuggestionIndex.value = Math.max(
                selectedSuggestionIndex.value - 1,
                -1,
            )
            break
        case 'Enter':
            event.preventDefault()
            if (selectedSuggestionIndex.value >= 0) {
                selectSuggestion(
                    searchSuggestions.value[selectedSuggestionIndex.value],
                )
            } else {
                performSearch()
            }
            break
        case 'Escape':
            showSuggestions.value = false
            selectedSuggestionIndex.value = -1
            searchInput.value?.blur()
            break
    }
}

const selectSuggestion = suggestion => {
    searchQuery.value = suggestion
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
    performSearch()
}

const hideSuggestions = () => {
    // Delay hiding to allow click events on suggestions
    setTimeout(() => {
        showSuggestions.value = false
        selectedSuggestionIndex.value = -1
    }, 150)
}

// Profile menu
const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value
}

const toggleDarkMode = () => {
    toast.info('سيتم تفعيل الوضع الليلي لاحقاً 🌙')
}

const logout = () => {
    toast.success('logout successfully')
    router.push('/auth/login')
    showProfileMenu.value = false
    authStore.logout()
}

// Close on outside click
onClickOutside(profileMenuRef, () => (showProfileMenu.value = false))

// Close mobile search on escape key
onMounted(() => {
    // Initialize search store
    searchStore.initialize()

    const handleEscape = e => {
        if (e.key === 'Escape') {
            showMobileSearch.value = false
            showProfileMenu.value = false
            showSuggestions.value = false
            selectedSuggestionIndex.value = -1
        }
    }
    document.addEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

.fixed {
    transition: all 0.3s ease-in-out;
}

@media (max-width: 768px) {
    button {
        min-width: 44px;
        min-height: 44px;
    }
}
</style>
