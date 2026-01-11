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
export const fetchNotifications = async () => {
    return await api.get('/notifications')
}
export const deleteNotification = async notificationId => {
    return await api.delete(`/notifications/${notificationId}`)
}
export const createNotification = async data => {
    try {
        const response = await api.post('/posts', data)

        return {
            success: true,
            data: response.data,
            message: 'Post created successfully',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}
