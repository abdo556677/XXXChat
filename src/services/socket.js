import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

class SocketService {
    constructor() {
        this.socket = null
        this.isConnected = true
    }

    connect() {
        if (this.socket?.connected) return

        const authStore = useAuthStore()
        const token = authStore.accessToken

        if (!token) {
            console.warn('No token available for socket connection')
            return
        }

        this.socket = io('http://localhost:3000', {
            auth: {
                token: token,
            },
            transports: ['websocket', 'polling'],
        })

        this.setupEventListeners()
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.isConnected = false
        }
    }

    setupEventListeners() {
        const chatStore = useChatStore()

        this.socket.on('connect', () => {
            console.log('Connected to socket server')
            this.isConnected = true

            // Join user's room
            const authStore = useAuthStore()
            if (authStore.user?.id) {
                this.socket.emit('join', { userId: authStore.user.id })
            }
        })

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server')
            this.isConnected = false
        })

        // Listen for new messages
        this.socket.on('newMessage', async message => {
            console.log('New message received:', message)
            await chatStore.receiveNewMessage(message)
        })

        // Listen for typing indicators
        this.socket.on('typing', data => {
            console.log('Typing indicator:', data)
            // Handle typing indicator
        })

        // Listen for user status updates
        this.socket.on('userStatus', data => {
            console.log('User status update:', data)
            chatStore.updateUserStatus(data.userId, data.isOnline)
        })

        // Listen for message read status
        this.socket.on('messageRead', data => {
            console.log('Message read:', data)
            // Handle message read status
        })

        // Listen for errors
        this.socket.on('error', error => {
            console.error('Socket error:', error)
        })
    }

    // Send a message
    sendMessage(messageData) {
        if (this.socket && this.isConnected) {
            this.socket.emit('sendMessage', messageData)
        } else {
            console.log(this.socket,this.isConnected)
            console.warn('Socket not connected')
        }
    }

    // Send typing indicator
    sendTyping(chatId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('typing', { chatId })
        }
    }

    // Mark messages as read
    markAsRead(chatId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('markAsRead', { chatId })
        }
    }

    // Join a chat room
    joinChat(chatId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('joinChat', { chatId })
        }
    }

    // Leave a chat room
    leaveChat(chatId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('leaveChat', { chatId })
        }
    }
}

// Create singleton instance
const socketService = new SocketService()

export default socketService
