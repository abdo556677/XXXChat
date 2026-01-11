// src/api/chatApi.js
import api from '@/utils/api'

// Constants for default values and error messages
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 50
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'خطأ في الشبكة. يرجى التحقق من اتصالك.',
    SERVER_ERROR: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    UNAUTHORIZED: 'مطلوب مصادقة. يرجى تسجيل الدخول.',
    DEFAULT: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
}

// Utility function for consistent error handling
const handleApiError = error => {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('Chat API Error:', error)
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
                    'طلب غير صالح. يرجى التحقق من بياناتك.'
                break
            case 401:
                userMessage = ERROR_MESSAGES.UNAUTHORIZED
                break
            case 403:
                userMessage = 'ليس لديك صلاحية لتنفيذ هذا الإجراء.'
                break
            case 404:
                userMessage = 'لم يتم العثور على المورد المطلوب.'
                break
            case 422:
                userMessage =
                    error.response.data?.message ||
                    'خطأ في التحقق. يرجى التحقق من بياناتك.'
                break
            case 429:
                userMessage = 'طلبات كثيرة جداً. يرجى المحاولة مرة أخرى لاحقاً.'
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

// Main API functions for Chats

/**
 * Fetch all chats for the authenticated user
 * @param {number} page - Page number
 * @param {number} limit - Number of chats per page
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with chats data
 */
export const fetchChats = async (
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    options = {},
) => {
    try {
        const response = await api.get('/chats', {
            params: {
                page: Math.max(1, page),
                limit: Math.max(1, Math.min(limit, 100)),
                ...options.params,
            },
            ...options,
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

/**
 * Fetch messages for a specific chat
 * @param {string} chatId - ID of the chat
 * @param {number} page - Page number
 * @param {number} limit - Number of messages per page
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with messages data
 */
export const fetchChatMessages = async (
    chatId,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    options = {},
) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.get(`/chats/${chatId}/messages`, {
            params: {
                page: Math.max(1, page),
                limit: Math.max(1, Math.min(limit, 100)),
                ...options.params,
            },
            ...options,
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

/**
 * Send a new message in a chat
 * @param {string} chatId - ID of the chat
 * @param {string} content - Message content
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with sent message data
 */
export const sendMessage = async ( chatId, content , options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        if (!content || content.trim().length === 0) {
            throw new Error('Message content is required')
        }

        const response = await api.post(
            `/chats/${chatId}/messages`,
            { content: content.trim() },
            options,
        )
        return {
            success: true,
            data: response.data,
            message: 'تم إرسال الرسالة بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Create a new chat with a user
 * @param {string} userId - ID of the user to chat with
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with created chat data
 */
export const createChat = async (participants, options = {}) => {
    try {
        if (participants.length <= 0) {
            throw new Error('User ID is required')
        }

        const response = await api.post('/chats', { participants }, options)

        return {
            success: true,
            data: response.data,
            message: 'تم إنشاء الدردشة بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Mark all messages in a chat as read
 * @param {string} chatId - ID of the chat
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const markChatAsRead = async (chatId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.put(`/chats/${chatId}/read`, null, options)

        return {
            success: true,
            data: response.data,
            message: 'تم تحديث حالة القراءة',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Send typing indicator
 * @param {string} chatId - ID of the chat
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const sendTypingIndicator = async (chatId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.post(
            `/chats/${chatId}/typing`,
            null,
            options,
        )

        return {
            success: true,
            data: response.data,
            message: 'تم إرسال إشارة الكتابة',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Search for users to start a new chat
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with search results
 */
export const searchUsers = async (query, limit = 10, options = {}) => {
    try {
        if (!query || query.trim().length === 0) {
            throw new Error('Search query is required')
        }

        const response = await api.get('/users/search', {
            params: {
                q: query.trim(),
                limit: Math.max(1, Math.min(limit, 50)),
                ...options.params,
            },
            ...options,
        })

        return {
            success: true,
            data: response.data,
            message: 'تم البحث بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Get a specific chat by ID
 * @param {string} chatId - ID of the chat
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with chat data
 */
export const getChatById = async (chatId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.get(`/chats/${chatId}`, options)

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Delete a chat
 * @param {string} chatId - ID of the chat to delete
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const deleteChat = async (chatId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.delete(`/chats/${chatId}`, options)

        return {
            success: true,
            data: response.data,
            message: 'تم حذف الدردشة بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Clear all messages in a chat
 * @param {string} chatId - ID of the chat
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const clearChatMessages = async (chatId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.delete(`/chats/${chatId}/messages`, options)

        return {
            success: true,
            data: response.data,
            message: 'تم مسح الرسائل بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Update chat settings
 * @param {string} chatId - ID of the chat
 * @param {Object} updates - Settings to update
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const updateChat = async (chatId, updates, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.put(`/chats/${chatId}`, updates, options)

        return {
            success: true,
            data: response.data,
            message: 'تم تحديث الدردشة بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Check if user is online
 * @param {string} userId - ID of the user
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with online status
 */
export const checkUserOnlineStatus = async (userId, options = {}) => {
    try {
        if (!userId) {
            throw new Error('User ID is required')
        }

        const response = await api.get(`/users/${userId}/online`, options)

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Send a message with attachments
 * @param {string} chatId - ID of the chat
 * @param {FormData} formData - Form data containing content and files
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with sent message data
 */
export const sendMessageWithAttachments = async (
    chatId,
    formData,
    options = {},
) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        if (!(formData instanceof FormData)) {
            throw new Error('Form data must be an instance of FormData')
        }

        const response = await api.post(
            `/chats/${chatId}/messages/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...options.headers,
                },
                onUploadProgress: options.onUploadProgress,
                ...options,
            },
        )

        return {
            success: true,
            data: response.data,
            message: 'تم إرسال الرسالة بالمرفقات بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Delete a specific message
 * @param {string} chatId - ID of the chat
 * @param {string} messageId - ID of the message to delete
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const deleteMessage = async (chatId, messageId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        if (!messageId) {
            throw new Error('Message ID is required')
        }

        const response = await api.delete(
            `/chats/${chatId}/messages/${messageId}`,
            options,
        )
        return {
            success: true,
            data: response.data,
            message: 'تم حذف الرسالة بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * React to a message
 * @param {string} chatId - ID of the chat
 * @param {string} messageId - ID of the message
 * @param {string} reaction - Reaction emoji
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response object
 */
export const reactToMessage = async (
    chatId,
    messageId,
    reaction,
    options = {},
) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        if (!messageId) {
            throw new Error('Message ID is required')
        }

        if (!reaction) {
            throw new Error('Reaction is required')
        }

        const response = await api.post(
            `/chats/${chatId}/messages/${messageId}/reactions`,
            { reaction },
            options,
        )

        return {
            success: true,
            data: response.data,
            message: 'تم إضافة التفاعل بنجاح',
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

/**
 * Get chat participants
 * @param {string} chatId - ID of the chat
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response with participants data
 */
export const getChatParticipants = async (chatId, options = {}) => {
    try {
        if (!chatId) {
            throw new Error('Chat ID is required')
        }

        const response = await api.get(`/chats/${chatId}/participants`, options)

        return {
            success: true,
            data: response.data,
        }
    } catch (error) {
        throw handleApiError(error)
    }
}

// WebSocket helper functions

/**
 * Establish WebSocket connection for real-time chat
 * @param {string} token - Authentication token
 * @param {Function} onMessage - Callback for new messages
 * @param {Function} onUserStatusChange - Callback for user status changes
 * @param {Function} onTyping - Callback for typing indicators
 * @returns {WebSocket} WebSocket connection
 */
export const connectToChatSocket = (
    token,
    onMessage,
    onUserStatusChange,
    onTyping,
) => {
    try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const host = process.env.VUE_APP_WS_HOST || window.location.host
        const socket = new WebSocket(
            `${protocol}//${host}/ws/chat?token=${token}`,
        )

        socket.onopen = () => {
            console.log('WebSocket connection established for chat')
        }

        socket.onmessage = event => {
            try {
                const data = JSON.parse(event.data)

                switch (data.type) {
                    case 'NEW_MESSAGE':
                        if (onMessage) onMessage(data.message)
                        break
                    case 'USER_STATUS':
                        if (onUserStatusChange)
                            onUserStatusChange(data.userId, data.isOnline)
                        break
                    case 'TYPING':
                        if (onTyping)
                            onTyping(data.chatId, data.userId, data.isTyping)
                        break
                    case 'MESSAGE_READ':
                        // Handle message read receipts
                        break
                    default:
                        console.warn(
                            'Unknown WebSocket message type:',
                            data.type,
                        )
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error)
            }
        }

        socket.onerror = error => {
            console.error('WebSocket error:', error)
        }

        socket.onclose = event => {
            console.log(
                'WebSocket connection closed:',
                event.code,
                event.reason,
            )

            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                console.log('Attempting to reconnect WebSocket...')
                return connectToChatSocket(
                    token,
                    onMessage,
                    onUserStatusChange,
                    onTyping,
                )
            }, 5000)
        }

        return socket
    } catch (error) {
        console.error('Failed to establish WebSocket connection:', error)
        throw error
    }
}

/**
 * Send a WebSocket message
 * @param {WebSocket} socket - WebSocket connection
 * @param {Object} data - Data to send
 * @returns {boolean} Success status
 */
export const sendWebSocketMessage = (socket, data) => {
    try {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data))
            return true
        }
        return false
    } catch (error) {
        console.error('Error sending WebSocket message:', error)
        return false
    }
}

// Export constants for external use
export const CHAT_API_CONSTANTS = {
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    MAX_LIMIT: 100,
    ERROR_MESSAGES,
}

// Type hints for better IDE support (JSDoc comments)
/**
 * @typedef {Object} ChatResponse
 * @property {boolean} success - Whether the request was successful
 * @property {any} data - The response data
 * @property {string} [message] - Optional success/error message
 */

/**
 * @typedef {Object} Chat
 * @property {string} _id - Chat ID
 * @property {Object} user - Chat participant
 * @property {string} user._id - User ID
 * @property {string} user.name - User name
 * @property {boolean} user.isOnline - User online status
 * @property {string} user.avatar - User avatar URL
 * @property {Object} lastMessage - Last message in chat
 * @property {number} unreadCount - Number of unread messages
 * @property {Date} createdAt - Chat creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Message
 * @property {string} _id - Message ID
 * @property {string} content - Message content
 * @property {Object} sender - Message sender
 * @property {string} sender._id - Sender ID
 * @property {string} sender.name - Sender name
 * @property {string} chatId - Chat ID
 * @property {Date} timestamp - Message timestamp
 * @property {boolean} read - Whether message is read
 * @property {boolean} isPending - Whether message is pending
 * @property {boolean} isFailed - Whether message failed to send
 * @property {Array} attachments - Message attachments
 */
