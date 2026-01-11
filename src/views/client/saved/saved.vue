<template>
  <main
    class="flex-1 rounded-lg p-4 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800"
    style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
  >
    <div class="h-full" ref="feedEl">
      <div class="max-w-4xl mx-auto p-2 space-y-6">
        <!-- المنشورات -->
        <div
          v-for="post in postStore.postsSaved"
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
            <span class="text-gray-600">جاري تحميل المزيد من المنشورات...</span>
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
            <p class="text-gray-600">لقد شاهدت كل المنشورات المتاحة حالياً.</p>
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
              لا توجد محفوظات اخرى
            </h3>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'

import PostCard from '@/components/PostCard.vue'
import { useInfiniteScroll } from '@vueuse/core'

// const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()

const feedEl = ref(null)
onMounted(async () => {
  authStore.initialize()
  await postStore.fetchSavedPosts()
})

useInfiniteScroll(
  feedEl,
  async () => {
    if (postStore.hasMore) await postStore.fetchPosts()
  },
  { distance: 500 },
)

// === حالة التحميل ===
const isLoading = computed(() => postStore.loading)

// const goTo = path => {
//   router.push(path)
// }


</script>
