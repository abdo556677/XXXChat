import { defineStore } from 'pinia'
import {
    addLikePost,
    unlikePost,
    addPost,
    fetchPosts,
    fetchComments,
    deletePost,
    savePost,
    unsavePost,
    addComment,
    deleteComment1,
    fetchSavedPosts,
    editPost,
    searchPosts,
} from '@/services/postApi'
import { uploadFile } from '@/config/supabase'

import { useAuthStore } from '@/stores/auth'
export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        searchResults: [],
        loading: false,
        hasMore: false,
        comments: [],
        postsSaved: [],
    }),
    getters: {
        getPosts: state => state.posts,
        getSearchResults: state => state.searchResults,
        getPostsByUser: state => id =>
            state.posts.filter(post => post.author.id == id),
    },
    actions: {
        async createPost(formData) {
            this.loading = true

            try {
                const response = await addPost(formData)

                const newPost = {
                    id: response.data._id,
                    content: response.data.content,
                    image: null,
                    video: null,
                    author: {
                        name: 'this user posted now',
                    },
                    createdAt: response.data.createdAt,
                    comments: [],
                    likes: [],
                    likesCount: 0,
                    commentsCount: 0,
                    sharesCount: 0,
                    isLiked: false,
                    isSaved: false,
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
                // await new Promise(resolve => setTimeout(resolve, 1000))
                const response = (await searchPosts(query)).data
                console.log(response.data.posts)

                const posts = response.data.posts.map(post => ({
                    id: post._id,
                    author: { name: post.userId.username, id: post.userId._id },
                    createdAt: post.createdAt,
                    comments: post.comments,
                    content: post.content,
                    image: null,
                    likesCount: post.likes.length,
                    commentsCount: post.comments.length,
                    sharesCount: 8,
                    isLiked: post.hasLiked,
                    isSaved: post.isSaved,
                    likes: post.likes,
                }))
                this.searchResults = posts
                // this.searchResults = this.posts.filter(post =>
                //     post.content.toLowerCase().startsWith(query.toLowerCase()),
                // )
            } catch (error) {
                console.error('Search failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async fetchPosts() {
            this.loading = true
            const authStore = useAuthStore()
            try {
                // Simulate API call
                const data = await (await fetchPosts()).data
                const posts = data.map(post => ({
                    id: post._id,
                    author: { name: post.userId.username, id: post.userId._id },
                    createdAt: post.createdAt,
                    comments: post.comments,
                    content: post.content,
                    image: post.image,
                    likesCount: post.likes.length,
                    commentsCount: post.comments.length,
                    sharesCount: 8,
                    isLiked: post.likes.indexOf(authStore.user.id, 0)
                        ? false
                        : true,
                    isSaved: post.isSaved,
                    likes: post.likes,
                }))
                if (this.posts.length > 0) return
                else this.posts = posts
            } catch (error) {
                console.error('Fetch posts failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async fetchSavedPosts() {
            this.loading = true
            try {
                // Simulate API call
                const response = await (await fetchSavedPosts(1, 1)).data
                console.log(response)
                const data = response.map(post => ({
                    id: post._id,
                    author: { name: post.userId.username },
                    createdAt: post.createdAt,
                    comments: post.comment,
                    content: post.content,
                    image: post.image,
                    likesCount: post.likes.length,
                    commentsCount: post.comments.length,
                    sharesCount: 8,
                    isLiked: post.isLiked,
                    isSaved: true,
                }))
                console.log(this.posts)
                // this.posts.push()
                if (this.postsSaved.length > 0) return
                else this.postsSaved = data
            } catch (error) {
                console.error('Fetch posts failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async fetchUserPosts(id) {
            this.loading = true
            try {
                return this.posts.filter(post => post.author.id == id)
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        async getPostById(postId) {
            const post = this.posts.find(p => p.id == postId)
            if (!post) return

            return post
        },
        async likePost(postId) {
            const post = this.posts.find(p => p.id === postId)
            if (!post) return
            const authStore = useAuthStore()
            const userId = authStore.user.id
            const index = post.likes.findIndex(id => id === userId)
            console.log(index)
            if (index >= 0) {
                try {
                    await unlikePost(postId)
                    post.likes.splice(index, 1)
                    post.likesCount = post.likes.length
                    post.isLiked = false
                } catch (err) {
                    console.error('Failed to unlike post', err)
                }
            } else {
                try {
                    await addLikePost(postId)
                    post.likes.push(userId)
                    post.likesCount = post.likes.length
                    post.isLiked = true
                } catch (err) {
                    console.error('Failed to like post', err)
                }
            }
        },
        async fetchComments(postId) {
            this.loading = true
            try {
                const response = await fetchComments(postId)
                const post = this.posts.find(p => p.id === postId)
                if (post && response) {
                    const data = response.data.comments.map(comment => ({
                        id: comment._id,
                        author: {
                            name: comment.userId.username,
                            id: comment.userId._id,
                        },
                        content: comment.content,
                        createdAt: comment.createdAt,
                    }))
                    post.comments = data
                }
                // const response = await fetchComments(postId)
                // const post = this.posts.find(p => p.id === postId)
                // if (post) {
                //     // Only update comments if we don't have local comments or if API returns data
                //     if (
                //         post.comments.length === 0 ||
                //         (response.data && response.data.length > 0)
                //     ) {
                //         post.comments = response.data || []
                //     }
                // }
            } catch (error) {
                console.error('Fetch comments failed:', error)
                // Don't throw error to prevent UI issues, just log it
            } finally {
                this.loading = false
            }
        },
        async addComment(postId, content, user) {
            const post = this.posts.find(p => p.id === postId)
            if (post) {
                const comment = await addComment(postId, content)
                post.comments.unshift({
                    id: comment.data._id,
                    content,
                    author: { name: user.username },
                    createdAt: new Date(),
                })
                post.commentsCount++
            }
        },
        async deleteComment(postId, commentId) {
            const authStore = useAuthStore()
            const post = this.posts.find(p => p.id === postId)
            console.log(post)
            if (post) {
                await deleteComment1(postId, commentId, authStore.user.id)

                const index = post.comments.findIndex(c => c.id === commentId)
                if (index !== -1) {
                    post.comments.splice(index, 1)
                }
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
            let post = this.posts.find(p => p.id === postId)

            if (!post) {
                post = this.postsSaved.find(p => p.id === postId)
                if (!post) return // إذا ما لقيت في الاثنين، خروج
            }

            if (!post.isSaved) {
                await savePost(postId)
                post.isSaved = true
                this.postsSaved.push(post)
            } else {
                await unsavePost(postId)
                post.isSaved = false
                const index = this.postsSaved.findIndex(p => p.id === postId)
                if (index !== -1) {
                    this.postsSaved.splice(index, 1)
                }
            }
        },
        async editPost(postId, newContent) {
            const post = this.posts.find(p => p.id === postId)
            if (post) {
                await editPost(postId, newContent)
                post.content = newContent
            }
        },
        async deletePost(postId) {
            const index = this.posts.findIndex(p => p.id === postId)
            if (index !== -1) {
                this.posts.splice(index, 1)
                await deletePost(postId)
            }
        },
    },
})
