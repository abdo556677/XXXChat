// authApi.js

import api from '@/utils/api'

// Define types for better TypeScript support
/**
 * @typedef {Object} AuthCredentials
 * @property {string} email - User's email
 * @property {string} password - User's password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {boolean} success - Whether the request was successful
 * @property {Object|null} data - Response data from server
 * @property {string} message - Human readable message
 * @property {string|null} error - Error code or identifier
 * @property {number|null} statusCode - HTTP status code
 */

/**
 * Enhanced login function with better error handling and logging
 * @param {AuthCredentials} credentials - User login credentials
 * @returns {Promise<LoginResponse>} Login response object
 */
export const login = async credentials => {
    // Input validation
    if (!credentials?.email || !credentials?.password) {
        return {
            success: false,
            data: null,
            message: 'Email and password are required',
            error: 'VALIDATION_ERROR',
            statusCode: 400,
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
        return {
            success: false,
            data: null,
            message: 'Please enter a valid email address',
            error: 'INVALID_EMAIL',
            statusCode: 400,
        }
    }

    try {
        
        const response = await api.post('/auth/login', credentials, {
            timeout: 3000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Log successful login (consider privacy implications)
        // console.info('Login successful for user:', credentials.email)
        // console.log(response.data)
        return {
            success: true,
            data: response.data,
            message: 'Login successful',
            error: null,
            statusCode: response.status,
        }
    } catch (error) {
        // Determine error type and message
        let errorMessage = 'Login failed'
        let errorCode = 'UNKNOWN_ERROR'
        let statusCode = null

        if (error.response) {
            // Server responded with error status
            statusCode = error.response.status

            // Map common HTTP status codes to user-friendly messages
            const errorMessages = {
                401: 'Invalid email or password',
                403: 'Account is disabled or locked',
                404: 'Authentication service unavailable',
                422: 'Invalid input data',
                429: 'Too many attempts. Please try again later',
                500: 'Server error. Please try again later',
            }

            errorMessage =
                errorMessages[statusCode] ||
                error.response?.data?.message ||
                error.response?.statusText ||
                'Authentication failed'

            // Set error code based on status
            errorCode = `HTTP_${statusCode}`

            // Log server errors for debugging
            if (statusCode >= 500) {
                console.error('Server error during login:', {
                    status: statusCode,
                    data: error.response.data,
                    user: credentials.email,
                })
            }
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Network error. Please check your connection'
            errorCode = 'NETWORK_ERROR'
            console.error('Network error during login:', error.message)
        } else if (error.code === 'ECONNABORTED') {
            // Request timeout
            errorMessage = 'Request timeout. Please try again'
            errorCode = 'TIMEOUT_ERROR'
        } else {
            // Other errors
            errorMessage = error.message || 'An unexpected error occurred'
            console.error('Unexpected login error:', error)
        }

        // Don't expose sensitive error details in production
        if (
            process.env.NODE_ENV === 'production' &&
            !['401', '403', '429'].includes(String(statusCode))
        ) {
            errorMessage = 'An error occurred during login. Please try again.'
        }

        return {
            success: false,
            data: null,
            message: errorMessage,
            error: errorCode,
            statusCode: statusCode,
        }
    }
}
export const register = async credentials => {
    // Input validation
    if (!credentials?.email || !credentials?.password) {
        return {
            success: false,
            data: null,
            message: 'Email and password are required',
            error: 'VALIDATION_ERROR',
            statusCode: 400,
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
        return {
            success: false,
            data: null,
            message: 'Please enter a valid email address',
            error: 'INVALID_EMAIL',
            statusCode: 400,
        }
    }

    try {
        const response = await api.post('/auth/register', credentials, {
            timeout: 10000, // 10 second timeout
            headers: {
                'Content-Type': 'application/json',
            },
        })

        // Log successful login (consider privacy implications)
        console.info('Login successful for user:', credentials.email)

        return {
            success: true,
            data: response.data,
            message: 'Login successful',
            error: null,
            statusCode: response.status,
        }
    } catch (error) {
        // Determine error type and message
        let errorMessage = 'Login failed'
        let errorCode = 'UNKNOWN_ERROR'
        let statusCode = null

        if (error.response) {
            // Server responded with error status
            statusCode = error.response.status

            // Map common HTTP status codes to user-friendly messages
            const errorMessages = {
                401: 'Invalid email or password',
                403: 'Account is disabled or locked',
                404: 'Authentication service unavailable',
                422: 'Invalid input data',
                429: 'Too many attempts. Please try again later',
                500: 'Server error. Please try again later',
            }

            errorMessage =
                errorMessages[statusCode] ||
                error.response?.data?.message ||
                error.response?.statusText ||
                'Authentication failed'

            // Set error code based on status
            errorCode = `HTTP_${statusCode}`

            // Log server errors for debugging
            if (statusCode >= 500) {
                console.error('Server error during login:', {
                    status: statusCode,
                    data: error.response.data,
                    user: credentials.email,
                })
            }
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Network error. Please check your connection'
            errorCode = 'NETWORK_ERROR'
            console.error('Network error during login:', error.message)
        } else if (error.code === 'ECONNABORTED') {
            // Request timeout
            errorMessage = 'Request timeout. Please try again'
            errorCode = 'TIMEOUT_ERROR'
        } else {
            // Other errors
            errorMessage = error.message || 'An unexpected error occurred'
            console.error('Unexpected login error:', error)
        }

        // Don't expose sensitive error details in production
        if (
            process.env.NODE_ENV === 'production' &&
            !['401', '403', '429'].includes(String(statusCode))
        ) {
            errorMessage = 'An error occurred during login. Please try again.'
        }

        return {
            success: false,
            data: null,
            message: errorMessage,
            error: errorCode,
            statusCode: statusCode,
        }
    }
}
// Optional: Add logout function
/**
 * Logout user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
    try {
        await api.post('/auth/logout')
        return {
            success: true,
            message: 'Logged out successfully',
        }
    } catch (error) {
        console.error('Logout error:', error)
        return {
            success: false,
            message: 'Failed to logout',
        }
    }
}
export const getTerms = async () => {
    try {
        const response = await api.get('/auth/terms', {
            timeout: 5000, // 5 second timeout
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return {
            success: true,
            data: response.data,
            message: 'Terms fetched successfully',
        }
    } catch (error) {
        let errorMessage = 'Failed to fetch terms'
        let errorCode = 'UNKNOWN_ERROR'
        let statusCode = null

        if (error.response) {
            // Server responded with error status
            statusCode = error.response.status
            errorMessage =
                error.response?.data?.message ||
                error.response?.statusText ||
                'Failed to fetch terms'
            errorCode = `HTTP_${statusCode}`
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Network error. Please check your connection'
            errorCode = 'NETWORK_ERROR'
        } else if (error.code === 'ECONNABORTED') {
            // Request timeout
            errorMessage = 'Request timeout. Please try again'
            errorCode = 'TIMEOUT_ERROR'
        } else {
            // Other errors
            errorMessage = error.message || 'An unexpected error occurred'
            console.error('Unexpected error while fetching terms:', error)
        }
        return {
            success: false,
            data: null,
            message: errorMessage,
            error: errorCode,
            statusCode: statusCode,
        }
    }
}
export const fetchUser = async () => {
    return await api.get('/auth/me') // الكوكيز تُرسل تلقائيًا
}
// Optional: Add token refresh function
/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<LoginResponse>} Refresh response
 */
export const refreshToken = async refreshToken => {
    try {
        const response = await api.post('/auth/refresh', { refreshToken })
        return {
            success: true,
            data: response.data,
            message: 'Token refreshed successfully',
        }
    } catch (error) {
        return {
            success: false,
            message: 'Token refresh failed',
            error: error.response?.status || 'REFRESH_FAILED',
        }
    }
}

// Export all auth functions
export default {
    login,
    logout,
    refreshToken,
    register,
    getTerms,
    fetchUser,
}
