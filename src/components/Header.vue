<template>
  <header class="bg-white px-4 shadow-sm border-b border-gray-200 relative">
    <div class="max-w-7xl mx-auto h-16 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center space-x-4">
        <div @click="goTo('/home')" class="flex items-center space-x-2 cursor-pointer">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            S
          </div>
          <span class="hidden sm:block font-bold text-xl text-gray-900">Social</span>
        </div>
      </div>

      <!-- Search (desktop) -->
      <div class="hidden md:flex flex-1 max-w-2xl mx-8">
        <div class="relative w-full">
          <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="ابحث عن الأصدقاء والمنشورات والمجموعات..."
            class="w-full pr-10 pl-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <div v-if="isSearching" class="absolute left-3 top-1/2 -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>

      <!-- Mobile Search Overlay -->
      <div v-if="showMobileSearch" class="fixed inset-0 bg-white z-50 md:hidden">
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <button @click="showMobileSearch = false" class="p-2">
              <X class="w-6 h-6 text-gray-600" />
            </button>
            <div class="flex-1 relative">
              <Search class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                @keyup.enter="performMobileSearch"
                type="text"
                placeholder="ابحث..."
                class="w-full pr-10 pl-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                ref="mobileSearchInput"
              />
            </div>
            <button
              @click="performMobileSearch"
              class="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium"
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      <!-- Icons -->
      <div class="flex items-center space-x-2 relative">
        <button
          @click="toggleMobileSearch"
          class="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Search class="w-6 h-6 text-gray-600" />
        </button>
        <button @click="goTo('/friends')" class="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Users class="w-6 h-6 text-gray-600" />
        </button>
        <button @click="goTo('/home')" class="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
          <House class="w-6 h-6 text-gray-600" />
        </button>
        <button
          @click=""
          class="p-2 rounded-full hover:bg-gray-100 relative transition-colors"
        >
          <Bell class="w-6 h-6 text-gray-600" />
          <span
            v-if="unreadNotifications > 0"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"
          ></span>
        </button>
        <button
          @click=""
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <MessageCircle class="w-6 h-6 text-gray-600" />
        </button>

        <!-- Profile Button -->
        <div class="relative" ref="profileMenuRef">
          <div
            @click="toggleProfileMenu"
            class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 shadow-lg transition-opacity"
          >
            {{ user?.name?.charAt(0).toUpperCase() || 'م' }}
          </div>

          <!-- Profile Dropdown -->
          <transition name="fade">
            <div
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
            >
              <button
                @click="goTo('/profile')"
                class="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
              >
                <span>صفحتي الشخصية</span>
                <User class="w-4 h-4 text-gray-500" />
              </button>
              <div class="border-t my-1"></div>
              <button
                @click="toggleDarkMode"
                class="w-full text-right px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between"
              >
                <span>الوضع الليلي</span>
                <Moon class="w-4 h-4 text-gray-500" />
              </button>
              <button
                @click="logout"
                class="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center justify-between"
              >
                <span>تسجيل الخروج</span>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { useToast } from 'vue-toastification'
import { 
  User, Users, House, Settings, Bell, MessageCircle,
  Search, X, Moon, LogOut
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()
const toast = useToast()

const user = computed(() => authStore.user || { name: 'Mohcine' })
const showProfileMenu = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
const showMobileSearch = ref(false)
const unreadNotifications = ref(3)
const mobileSearchInput = ref(null)
const profileMenuRef = ref(null)

// Navigation
const goTo = (path) => {
  router.push(path)
  showProfileMenu.value = false
}

// Search functions
const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  try {
    await postStore.searchPosts(searchQuery.value)
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
    await postStore.searchPosts(searchQuery.value)
    showMobileSearch.value = false
    toast.success(`نتائج البحث عن: ${searchQuery.value}`)
  } catch {
    toast.error('فشل في البحث')
  } finally {
    isSearching.value = false
  }
}

// Profile menu
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const toggleDarkMode = () => {
  toast.info('سيتم تفعيل الوضع الليلي لاحقاً 🌙')
}

const logout = () => {
  toast.success('تم تسجيل الخروج ❌')
  showProfileMenu.value = false
}

// Close on outside click
onClickOutside(profileMenuRef, () => (showProfileMenu.value = false))

// Close mobile search on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      showMobileSearch.value = false
      showProfileMenu.value = false
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
