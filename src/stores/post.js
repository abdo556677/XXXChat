import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    searchResults: [],
    loading: false,
    hasMore: true,
  }),
  getters: {
    getPosts: (state) => state.posts,
    getSearchResults: (state) => state.searchResults,
  },
  actions: {
    async createPost(formData) {
      this.loading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newPost = {
          id: Date.now(),
          content: formData.get('content'),
          image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : null,
          author: { name: 'Current User' },
          createdAt: new Date(),
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          isLiked: false,
          comments: []
        }
        this.posts.unshift(newPost)
      } catch (error) {
        console.error('Create post failed:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async searchPosts(query) {
      this.loading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.searchResults = [
          { id: 1, content: `Result for ${query}`, author: 'User1' },
          { id: 2, content: `Another result for ${query}`, author: 'User2' },
        ]
      } catch (error) {
        console.error('Search failed:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchPosts() {
      this.loading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.posts = [
          {
            id: 1,
            content: 'Sample post 1',
            author: { name: 'User1' },
            createdAt: new Date(),
            likesCount: 5,
            commentsCount: 2,
            sharesCount: 1,
            isLiked: false,
            comments: []
          },
          {
            id: 2,
            content: 'Sample post 2',
            author: { name: 'User2' },
            createdAt: new Date(),
            likesCount: 3,
            commentsCount: 0,
            sharesCount: 0,
            isLiked: false,
            comments: []
          },
        ]
      } catch (error) {
        console.error('Fetch posts failed:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    async likePost(postId) {
      // Simulate like
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.isLiked = !post.isLiked
        post.likesCount += post.isLiked ? 1 : -1
      }
    },
    async addComment(postId, content) {
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.comments.push({
          id: Date.now(),
          content,
          author: { name: 'Current User' },
          createdAt: new Date()
        })
        post.commentsCount++
      }
    },
    async sharePost(postId) {
      // Simulate share
      const post = this.posts.find(p => p.id === postId)
      if (post) {
        post.sharesCount++
      }
    },
    async savePost(postId) {
      // Simulate save
      console.log('Post saved:', postId)
    }
  }
})
