<template>
  <main
    class="flex-1 bg-white rounded-lg p-4 overflow-y-auto"
    style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
  >
    <div class="h-full" ref="feedEl">
      <div v-if="post.id != undefined" class="max-w-4xl mx-auto p-2 space-y-6">
        <!-- المنشورات -->
      <postCard :post="post"/>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'


import { useInfiniteScroll } from '@vueuse/core'
import postCard from '@/components/PostCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const postStore = usePostStore()

// === حالة المنشور الجديد ===


const post = ref({})
// === تحميل المنشورات ===
const feedEl = ref(null)
onMounted(async () => {
  authStore.initialize()
  await postStore.fetchPosts()
  post.value = await postStore.getPostById(router.currentRoute.value.params.id)
})

useInfiniteScroll(
  feedEl,
  async () => {
    if (postStore.hasMore) await postStore.fetchPosts()
  },
  { distance: 500 },
)





</script>
