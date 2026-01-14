import { defineStore } from 'pinia'
import {
    fetchUsers,
    searchUsers,
    followUser,
    unfollowUser,
    fetchUserProfile,
    fetchFollowers,
    fetchFollowing,
    fetchSuggestedUsers,
    updateUserProfile,
    blockUser,
    unblockUser,
    fetchBlockedUsers,
    fetchUserStats,
    getUserById,
} from '@/services/usersApi'
import { useAuthStore } from '@/stores/auth'

export const useUserStore = defineStore('user', {
    state: () => ({
        // Current authenticated user
        currentUser: null,
        isOnline: false,

        // Other users data
        users: [],
        suggestedUsers: [],
        followers: [],
        following: [],
        blockedUsers: [],
        searchResults: [],

        // User profiles cache
        userProfiles: {},

        // Loading states
        loading: false,
        loadingFollow: false,
        loadingProfile: false,
        loadingFollowers: false,
        loadingFollowing: false,

        // Pagination
        hasMoreUsers: true,
        usersPage: 1,
        followersPage: 1,
        followingPage: 1,

        error: null,
    }),

    getters: {
        // Get current user info
        getCurrentUser: state => state.currentUser,
        getCurrentUserId: state => state.currentUser?._id,

        // Get other users
        getUsers: state => state.users,
        getSuggestedUsers: state => state.suggestedUsers,
        getFollowers: state => state.followers,
        getFollowing: state => state.following,
        getBlockedUsers: state => state.blockedUsers,
        getSearchResults: state => state.searchResults,

        // Check relationships
        isFollowing: state => userId => {
            return state.following.some(user => user._id === userId)
        },
        isFollower: state => userId => {
            return state.followers.some(user => user._id === userId)
        },
        isBlocked: state => userId => {
            return state.blockedUsers.some(user => user._id === userId)
        },

        // Get user profile from cache
        getUserProfile: state => userId => {
            return state.userProfiles[userId] || null
        },

        // Get user by username
        getUserByUsername: state => username => {
            return [
                ...state.users,
                ...state.searchResults,
                ...state.followers,
                ...state.following,
            ].find(user => user.username === username)
        },

        // Stats
        getFollowersCount: state => state.currentUser?.followersCount || 0,
        getFollowingCount: state => state.currentUser?.followingCount || 0,
        getPostCount: state => state.currentUser?.postsCount || 0,

        // Loading states
        isLoading: state => state.loading,
        isLoadingProfile: state => state.loadingProfile,
    },

    actions: {
        // Set current user (called after login)
        setCurrentUser(user) {
            this.currentUser = user
            localStorage.setItem('currentUser', JSON.stringify(user))
        },

        // Get current user from localStorage
        loadCurrentUser() {
            const userData = localStorage.getItem('currentUser')
            if (userData) {
                this.currentUser = JSON.parse(userData)
            }
        },

        // Clear current user (logout)
        clearCurrentUser() {
            this.currentUser = null
            localStorage.removeItem('currentUser')
            this.clearAllData()
        },

        // Clear all user data
        clearAllData() {
            this.users = []
            this.suggestedUsers = []
            this.followers = []
            this.following = []
            this.blockedUsers = []
            this.searchResults = []
            this.userProfiles = {}
        },

        // Fetch user profile
        async fetchUserProfile(userId) {
            this.loadingProfile = true
            this.error = null

            try {
                const response = await fetchUserProfile(userId)
                this.userProfiles[userId] = response.data
                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to fetch user profile'
                console.error('Fetch user profile failed:', error)
                throw error
            } finally {
                this.loadingProfile = false
            }
        },

        // Search users
        async searchUsers(query) {
            this.loading = true
            this.error = null

            try {
                // const response = await searchUsers(query)
                this.searchResults = this.users.filter(user =>
                    user.name.toLowerCase().startsWith(query.toLowerCase()),
                )

                const response = (await searchUsers(query)).data
                console.log(this.searchResults)
                const data = response.data.users.map(user => ({
                    id: user._id,
                    name: user.username,
                    mutualFriends: 0,
                    isOnline: user.isOnline,
                    requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
                }))
                this.searchResults = data
            } catch (error) {
                this.error = error.message || 'Failed to search users'
                console.error('Search users failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async followUser(userId) {
            this.loadingFollow = true
            this.error = null

            try {
                // Call API
                const response = await followUser(userId)

                const user =
                    this.users.find(u => u.id === userId) ||
                    this.searchResults.find(u => u._id === userId) ||
                    this.followers.find(u => u.id === userId)

                if (user && response) {
                    user.isFollowing = true
                    user.followersCount = (user.followersCount || 0) + 1

                    // أضف المستخدم إلى قائمة following إن لم يكن موجودًا
                    if (!this.following.some(u => u._id === userId)) {
                        this.following.unshift(user)
                    }
                }
                // تحديث المستخدم الحالي (لو موجود)
                // if (this.currentUser) {
                //     this.currentUser.followingCount += 1
                // }

                // // تحديث ملف المستخدم إذا كان في الذاكرة
                // if (this.userProfiles[userId]) {
                //     this.userProfiles[userId].isFollowing = true
                //     this.userProfiles[userId].followersCount =
                //         (this.userProfiles[userId].followersCount || 0) + 1
                // }
                // return response.data
            } catch (error) {
                this.error = error.message || 'فشل في المتابعة'
                console.error('Follow user failed:', error)
                throw error
            } finally {
                this.loadingFollow = false
            }
        },
        // Unfollow user
        async unfollowUser(userId) {
            this.loadingFollow = true
            this.error = null

            try {
                await unfollowUser(userId)

                const user = this.following.findIndex(user => user.id == userId)
                this.following.splice(user, 1)

                // Update current user's following count
                // if (this.currentUser) {
                //   this.currentUser.followingCount -= 1
                // }

                // Update user in lists
                const userLists = [
                    this.users,
                    this.searchResults,
                    this.suggestedUsers,
                    this.following,
                ]
                userLists.forEach(list => {
                    const user = list.find(u => u.id === userId)
                    if (user) {
                        user.isFollowing = false
                        user.followersCount = Math.max(
                            0,
                            user.followersCount - 1,
                        )
                    }
                })

                // Remove from following list
                this.following = this.following.filter(
                    user => user._id !== userId,
                )

                // Update user profile if cached
                if (this.userProfiles[userId]) {
                    this.userProfiles[userId].isFollowing = false
                    this.userProfiles[userId].followersCount = Math.max(
                        0,
                        this.userProfiles[userId].followersCount - 1,
                    )
                }

                // return response.data
            } catch (error) {
                this.error = error.message || 'Failed to unfollow user'
                console.error('Unfollow user failed:', error)
                throw error
            } finally {
                this.loadingFollow = false
            }
        },

        // Fetch followers
        async fetchFollowers(page = 1, limit = 20) {
            this.loadingFollowers = true
            this.error = null

            try {
                const authStore = useAuthStore()
                const response = await fetchFollowers(authStore.user.id)
                const data = response.data.followers.map(user => ({
                    id: user._id,
                    name: user.username,
                    mutualFriends: 4,
                    isOnline: user.isOnline,
                    requestDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
                }))
                //await fetchFollowers(userId, page, limit);
                if (page === 1) {
                    this.followers = data
                } else {
                    this.followers = [...this.followers, ...data]
                }

                this.followersPage = page
                this.hasMoreFollowers = response.data.length === limit

                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to fetch followers'
                console.error('Fetch followers failed:', error)
                throw error
            } finally {
                this.loadingFollowers = false
            }
        },

        // Fetch following
        async fetchFollowing(page = 1, limit = 20) {
            this.loadingFollowing = true
            this.error = null

            const authStore = useAuthStore()

            try {
                const response = await fetchFollowing(authStore.user.id)

                const data = response.data.following.map(user => ({
                    id: user._id,
                    name: user.username,
                    mutualFriends: 4,
                    isOnline: user.isOnline,
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    // isFollower: user.isFollower,
                    isFollowing: true,
                }))
                if (page === 1) {
                    this.following = data
                } else {
                    this.following = [...this.following, ...data]
                }

                this.followingPage = page
                this.hasMoreFollowing = response.data.length === limit
            } catch (error) {
                this.error = error.message || 'Failed to fetch following'
                console.error('Fetch following failed:', error)
                throw error
            } finally {
                this.loadingFollowing = false
            }
        },

        // Fetch suggested users (who to follow)
        async fetchSuggestedUsers() {
            this.loading = true
            this.error = null

            try {
                const response = await fetchSuggestedUsers()
                this.suggestedUsers = response.data
                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to fetch suggested users'
                console.error('Fetch suggested users failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Fetch all users (for admin or explore)
        async fetchUsers(page = 1, limit = 20) {
            this.loading = true
            this.error = null

            try {
                const response = await fetchUsers()
                const data = response.data.map(user => ({
                    id: user._id,
                    name: user.username,
                    mutualFriends: user.mutualFriends.length,
                    friendsSince: new Date(
                        Date.now() - 30 * 24 * 60 * 60 * 1000,
                    ),
                    isOnline: user.isOnline,
                    isFollower: user.isFollower,
                    isFollowing: user.isFollowing,
                }))

                if (page === 1) {
                    this.users = data
                } else {
                    this.users = [...this.users, ...data]
                }

                this.usersPage = page
                this.hasMoreUsers = response.length === limit

                // return response.data
            } catch (error) {
                this.error = error.message || 'Failed to fetch users'
                console.error('Fetch users failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async updateUserProfile(userId, profileData) {
            this.loading = true
            this.error = null

            try {
                const response = await updateUserProfile(userId, profileData)

                // Update current user if it's the same user
                if (this.currentUser && this.currentUser._id === userId) {
                    this.currentUser = { ...this.currentUser, ...response.data }
                    localStorage.setItem(
                        'currentUser',
                        JSON.stringify(this.currentUser),
                    )
                }

                // Update in user profiles cache
                if (this.userProfiles[userId]) {
                    this.userProfiles[userId] = {
                        ...this.userProfiles[userId],
                        ...response.data,
                    }
                }

                // Update in all user lists
                const userLists = [
                    this.users,
                    this.followers,
                    this.following,
                    this.suggestedUsers,
                    this.searchResults,
                ]
                userLists.forEach(list => {
                    const userIndex = list.findIndex(u => u._id === userId)
                    if (userIndex !== -1) {
                        list[userIndex] = {
                            ...list[userIndex],
                            ...response.data,
                        }
                    }
                })

                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to update profile'
                console.error('Update profile failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Block user
        async blockUser(userId) {
            this.loading = true
            this.error = null

            try {
                const response = await blockUser(userId)

                // Remove from following list
                this.following = this.following.filter(
                    user => user._id !== userId,
                )

                // Remove from followers list
                this.followers = this.followers.filter(
                    user => user._id !== userId,
                )

                // Add to blocked users list
                const user = this.getUserById(userId)
                if (user && !this.blockedUsers.some(u => u._id === userId)) {
                    this.blockedUsers.push(user)
                }

                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to block user'
                console.error('Block user failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Unblock user
        async unblockUser(userId) {
            this.loading = true
            this.error = null

            try {
                const response = await unblockUser(userId)

                // Remove from blocked users list
                this.blockedUsers = this.blockedUsers.filter(
                    user => user._id !== userId,
                )

                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to unblock user'
                console.error('Unblock user failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Fetch blocked users
        async fetchBlockedUsers() {
            this.loading = true
            this.error = null

            try {
                const response = await fetchBlockedUsers()
                this.blockedUsers = response.data
                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to fetch blocked users'
                console.error('Fetch blocked users failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Fetch user stats
        async fetchUserStats(userId) {
            this.loading = true
            this.error = null

            try {
                const response = await fetchUserStats(userId)
                return response.data
            } catch (error) {
                this.error = error.message || 'Failed to fetch user stats'
                console.error('Fetch user stats failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async getUserById(userId) {
            this.loading = true
            try {
                const data = (await getUserById(userId)).data
                const user = {
                    id: data._id,
                    name: data.username,
                    content: data.bio,
                    email: data.email,
                    profilePicture: 'link',
                    bio: null,
                    followers: data.followers.length,
                    following: data.following.length,
                    birthDate: data.birthDate || '2025-12-31T00:01:48.118Z',
                    gender: data.gender,
                    role: 'user',
                    location: 'morocco',
                    createdAt: Date.now,
                    updatedAt: Date.now,
                    lastLogin: Date.now,
                    verificationStatus: data.verificationStatus,
                }
                this.currentUser = user
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        // Helper to get user by ID from all lists
        // getUserById(userId) {
        //   return [
        //     ...this.users,
        //     ...this.followers,
        //     ...this.following,
        //     ...this.suggestedUsers,
        //     ...this.searchResults,
        //   ].find(user => user._id === userId)
        // },

        // Clear search results
        clearSearchResults() {
            this.searchResults = []
        },
    },
})
