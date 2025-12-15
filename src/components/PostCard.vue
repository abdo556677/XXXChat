<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
    <!-- Post Header -->
    <div class="flex items-center mb-4">
      <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
        {{ post.user?.username?.charAt(0).toUpperCase() || 'U' }}
      </div>
      <div>
        <h3 class="font-semibold text-gray-900">{{ post.user?.username || 'Unknown User' }}</h3>
        <p class="text-sm text-gray-500">{{ formatDate(post.createdAt) }}</p>
      </div>
      <div class="ml-auto">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {{ post.category }}
        </span>
      </div>
    </div>

    <!-- Post Content -->
    <div class="mb-4">
      <p class="text-gray-800 whitespace-pre-wrap">{{ post.content }}</p>
    </div>

    <!-- Post Media -->
    <div v-if="post.image" class="mb-4">
      <img :src="post.image" alt="Post image" class="w-full rounded-lg max-h-96 object-cover" />
    </div>
    <div v-if="post.video" class="mb-4">
      <video :src="post.video" controls class="w-full rounded-lg max-h-96"></video>
    </div>

    <!-- Post Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-4">
        <button
          @click="toggleLike"
          class="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
          :class="{ 'text-red-500': isLiked }"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
          </svg>
          <span>{{ post.likes?.length || 0 }}</span>
        </button>
        <button class="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <span>{{ post.comments?.length || 0 }}</span>
        </button>
      </div>
      <div class="text-sm text-gray-500">
        {{ post.viewCount || 0 }} views
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/api'

export default {
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    isLiked() {
      const authStore = useAuthStore()
      return post.likes?.includes(authStore.user?.id)
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    async toggleLike() {
      try {
        if (this.isLiked) {
          await api.post(`/posts/${this.post._id}/unlike`)
        } else {
          await api.post(`/posts/${this.post._id}/like`)
        }
        // Refresh posts or update local state
        this.$emit('like-toggled')
      } catch (error) {
        console.error('Toggle like error:', error)
      }
    }
  }
}
</script>
