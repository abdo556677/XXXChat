import { defineStore } from 'pinia'
import { usePostStore } from '@/stores/post'
import { useUserStore } from '@/stores/users'

// Debounce utility function
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export const useSearchStore = defineStore('search', {
    state: () => ({
        query: '',
        results: {
            posts: [],
            users: [],
        },
        loading: false,
        currentContext: 'global', // 'global', 'posts', 'users'
        hasSearched: false,
        searchHistory: [],
        debouncedSearch: null,
    }),

    getters: {
        getResults: state => state.results,
        getLoading: state => state.loading,
        getCurrentContext: state => state.currentContext,
        hasResults: state => {
            return (
                state.results.posts.length > 0 || state.results.users.length > 0
            )
        },
    },

    actions: {
        setContext(context) {
            this.currentContext = context
        },
        async performSearch(query, context = null) {
            if (!query.trim()) return

            this.query = query
            this.loading = true
            this.hasSearched = true

            const searchContext = context || this.currentContext

            try {
                if (searchContext === 'posts' || searchContext === 'global') {
                    const postStore = usePostStore()
                    await postStore.searchPosts(query)
                    this.results.posts = postStore.searchResults
                }

                if (searchContext === 'users' || searchContext === 'global') {
                    const usersStore = useUserStore()
                    await usersStore.searchUsers(query)
                    this.results.users = usersStore.searchResults
                }
            } catch (error) {
                console.error('Search failed:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        clearResults() {
            this.results = { posts: [], users: [] }
            this.hasSearched = false
            this.query = ''
        },

        setQuery(query) {
            this.query = query
        },

        // Debounced search for real-time suggestions
        debouncedSearch(query, context = null) {
            if (this.debouncedSearch) {
                this.debouncedSearch.cancel()
            }

            this.debouncedSearch = debounce(() => {
                this.performSearch(query, context)
            }, 300)

            this.debouncedSearch()
        },

        // Add query to search history
        addToHistory(query) {
            if (!query.trim()) return

            // Remove if already exists
            this.searchHistory = this.searchHistory.filter(
                item => item !== query,
            )

            // Add to beginning
            this.searchHistory.unshift(query)

            // Keep only last 10 searches
            if (this.searchHistory.length > 10) {
                this.searchHistory = this.searchHistory.slice(0, 10)
            }

            this.saveSearchHistory()
        },

        // Clear search history
        clearHistory() {
            this.searchHistory = []
            localStorage.removeItem('search_history')
        },

        // Save search history to localStorage
        saveSearchHistory() {
            try {
                localStorage.setItem(
                    'search_history',
                    JSON.stringify(this.searchHistory),
                )
            } catch (error) {
                console.error('Failed to save search history:', error)
            }
        },

        // Load search history from localStorage
        loadSearchHistory() {
            try {
                const history = localStorage.getItem('search_history')
                if (history) {
                    this.searchHistory = JSON.parse(history)
                }
            } catch (error) {
                console.error('Failed to load search history:', error)
                this.searchHistory = []
            }
        },

        // Get search suggestions based on history
        getSuggestions(query) {
            if (!query.trim()) return []

            const lowerQuery = query.toLowerCase()
            return this.searchHistory
                .filter(item => item.toLowerCase().includes(lowerQuery))
                .slice(0, 5)
        },

        // Initialize search store
        initialize() {
            this.loadSearchHistory()
        },
    },
})
