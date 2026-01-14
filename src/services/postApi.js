// src/api/postApi.js
import api from '@/utils/api'
// Constants for default values and error messages
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Authentication required. Please log in.',
    DEFAULT: 'An error occurred. Please try again.',
}

// Utility function for consistent error handling
const handleApiError = error => {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error)
    }

    // Extract meaningful error message
    let userMessage = ERROR_MESSAGES.DEFAULT
    let statusCode = null

    if (error.response) {
        // The request was made and the server responded with a status code
        statusCode = error.response.status

        switch (statusCode) {
            case 400:
                userMessage =
                    error.response.data?.message ||
                    'Invalid request. Please check your input.'
                break
            case 401:
                userMessage = ERROR_MESSAGES.UNAUTHORIZED
                // Optionally trigger logout or redirect here
                break
            case 403:
                userMessage =
                    'You do not have permission to perform this action.'
                break
            case 404:
                userMessage = 'The requested resource was not found.'
                break
            case 422:
                userMessage =
                    error.response.data?.message ||
                    'Validation error. Please check your input.'
                break
            case 429:
                userMessage = 'Too many requests. Please try again later.'
                break
            case 500:
                userMessage = ERROR_MESSAGES.SERVER_ERROR
                break
            default:
                userMessage =
                    error.response.data?.message || ERROR_MESSAGES.DEFAULT
        }
    } else if (error.request) {
        // The request was made but no response was received
        userMessage = ERROR_MESSAGES.NETWORK_ERROR
    } else {
        // Something happened in setting up the request
        userMessage = error.message || ERROR_MESSAGES.DEFAULT
    }

    // Return a structured error object
    return {
        originalError: error,
        message: userMessage,
        statusCode,
        timestamp: new Date().toISOString(),
    }
}

// Utility function for retry logic (optional, for critical operations)
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await requestFn()
        } catch (error) {
            if (i === maxRetries - 1) throw error

            // Exponential backoff
            await new Promise(resolve =>
                setTimeout(resolve, delay * Math.pow(2, i)),
            )
        }
    }
}

// Main API functions
export const fetchPosts = async (
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    options = {},
) => {
    try {
        const response = await api.get('/posts', {
            params: {
                page: Math.max(1, page), // Ensure page is at least 1
                limit: Math.max(1, Math.min(limit, 100)), // Limit between 1 and 100
                ...options.params, // Allow additional params
            },
            ...options, // Pass additional axios options
        })

        return {
            success: true,
            data: response.data,
            pagination: {
                page: parseInt(response.headers['x-page']) || page,
                limit: parseInt(response.headers['x-limit']) || limit,
                total: parseInt(response.headers['x-total']) || 0,
                totalPages: parseInt(response.headers['x-total-pages']) || 0,
            },
        }
    } catch (error) {
        throw handleApiError(error)
    }
}
export const searchPosts = async query => {
    try {
        const response = await api.get('/posts/search', { params: { query } })

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const addPost = async formData => {
    try {
        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return {
            success: true,
            data: response.data,
            message: 'Post created successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const editPost = async (postId, content) => {
    try {
        const response = await api.put(`/posts/${postId}`, { content }) // axios JSON

        return {
            success: true,
            data: response.data,
            message: 'Post edit successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const addLikePost = async postId => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }
        const response = await api.post(`/posts/${postId}/like`)
        return {
            success: true,
            data: response.data,
            message: response.data.liked ? 'Post liked' : 'Post unliked',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}
export const unlikePost = async postId => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }
        const response = await api.post(`/posts/${postId}/unlike`)
        return {
            success: true,
            data: response.data,
            message: response.data.liked ? 'Post liked' : 'Post unliked',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const fetchComments = async (postId, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        const response = await api.get(`/posts/${postId}/comments`, options)

        return {
            success: true,
            data: response.data,
            message: 'Comments fetched successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const addComment = async (postId, content, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        if (!content || content.trim().length === 0) {
            throw new Error('Comment content is required')
        }

        const response = await api.post(
            `/posts/${postId}/comments`,
            { content: content.trim() },
            options,
        )

        return {
            success: true,
            data: response.data,
            message: 'Comment added successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const deleteComment1 = async (postId, CommentId, userId) => {
    try {
        if (!postId || !CommentId || !userId) {
            throw new Error('Post ID is required')
        }

        const response = await api.delete(
            `/posts/${postId}/comments/${CommentId}/${userId}`,
        )

        return {
            success: true,
            data: response.data,
            message: 'Comment added successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const sharePost = async (postId, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        const response = await api.post(`/posts/${postId}/share`, null, options)

        return {
            success: true,
            data: response.data,
            message: 'Post shared successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const savePost = async (postId, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        const response = await api.post(`/posts/${postId}/save`)

        return {
            success: true,
            data: response.data,
            message: response.data.saved ? 'Post saved' : 'Post unsaved',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}
export const unsavePost = async (postId, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        const response = await api.post(`/posts/${postId}/unsave`)

        return {
            success: true,
            data: response.data,
            message: response.data.saved ? 'Post saved' : 'Post unsaved',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}
// Additional utility functions that might be useful
export const getPostById = async (postId, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        const response = await api.get(`/posts/${postId}`, options)

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const updatePost = async (postId, updates, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        const response = await api.put(`/posts/${postId}`, updates, options)

        return {
            success: true,
            data: response.data,
            message: 'Post updated successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

export const deletePost = async (postId, options = {}) => {
    try {
        if (!postId) {
            throw new Error('Post ID is required')
        }

        await api.delete(`/posts/${postId}`, options)

        return {
            success: true,
            message: 'Post deleted successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

// Batch operations (if supported by backend)
export const fetchSavedPosts = async (postIds, options = {}) => {
    try {
        const response = await api.get('/posts/saved')

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}
export const fetchMultiplePosts = async (postIds, options = {}) => {
    try {
        const response = await api.get('/posts/batch', {
            params: { ids: postIds.join(',') },
            ...options,
        })

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

// Export constants for external use
export const POST_API_CONSTANTS = {
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    MAX_LIMIT: 100,
    ERROR_MESSAGES,
}

// Type hints for better IDE support (JSDoc comments)
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether the request was successful
 * @property {any} data - The response data
 * @property {string} [message] - Optional success/error message
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {boolean} success - Whether the request was successful
 * @property {any} data - The response data
 * @property {Object} pagination - Pagination information
 * @property {number} pagination.page - Current page
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.total - Total items
 * @property {number} pagination.totalPages - Total pages
 */
