// stores/chat.js
import { defineStore } from 'pinia'
import {
    createChat,
    fetchChats,
    fetchChatMessages,
    sendMessage,
    deleteMessage,
    deleteChat,
} from '@/services/chatApi'
import socketService from '@/services/socket'
import { useAuthStore } from './auth'
export const useChatStore = defineStore('chat', {
    state: () => ({
        chats: [],
        currentChat: {},
        messages: [],
        messagesSaver: [],
        searchResults: [],
        loading: false,
        hasMoreMessages: false,
        unreadCount: 0,
        onlineUsers: [],
    }),

    getters: {
        getChats: state => state.chats,
        getCurrentChat: state => state.currentChat,
        getSearchResults: state => state.searchResults,
        getUnreadCount: state => state.unreadCount,
        getOnlineUsers: state => state.onlineUsers,

        // فلترة الدردشات حسب البحث
        filteredChats: state => query => {
            if (!query) return state.chats
            return state.chats.filter(
                chat =>
                    chat.user.name
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    chat.lastMessage?.content
                        .toLowerCase()
                        .includes(query.toLowerCase()),
            )
        },

        // الحصول على دردشة بواسطة ID
        getChatById: state => chatId => {
            return state.chats.find(chat => chat._id === chatId)
        },

        // حساب عدد الرسائل غير المقروءة
        calculateUnreadCount: state => {
            return state.chats.reduce(
                (total, chat) => total + chat.unreadCount,
                0,
            )
        },
    },
    /*
        {
                "_id": "6945de446598bb935ff9c7fb",
                "participants": [
                    {
                        "_id": "6942fc6eaa435ccbc60714af",
                        "username": "admin"
                    }
                ],
                "createdAt": "2025-12-19T23:22:44.015Z",
                "updatedAt": "2025-12-20T16:52:08.487Z",
                "isGroup": false,
                "__v": 0,
                "lastMessage": {
                    "_id": "6946d43823bbbb13a92bee5c",
                    "senderId": "6942fcabaa435ccbc60714b4",
                    "content": "fdgfg",
                    "createdAt": "2025-12-20T16:52:08.483Z",
                    "isRead": false
                },
                "user": {
                    "_id": "6942fc6eaa435ccbc60714af",
                    "username": "admin"
                },
                "unreadCount": 0
            }

        
    */
    actions: {
        // تحميل جميع الدردشات
        async fetchChats() {
            this.loading = true
            try {
                const response = (await fetchChats()).data
                console.log(response)
                const data = response.data.chats.map(chat => {
                    const lastMessage = chat.lastMessage
                        ? {
                              id: chat.lastMessage._id,
                              senderId: chat.lastMessage.sender?._id ?? null,
                              content: chat.lastMessage.content,
                              timestamp: chat.lastMessage.createdAt,
                              isRead: chat.lastMessage.isRead ?? true,
                          }
                        : null

                    return {
                        id: chat._id,

                        participants: chat.participants.map(user => ({
                            id: user._id,
                            username: user.username,
                            isOnline: user.isOnline ?? false, // ✅ هنا
                        })),

                        type: chat.type,
                        title: null,
                        unreadCount: chat.unreadCount ?? 0,
                        lastMessage,

                        user: {
                            id: chat.user?._id ?? null,
                            username: chat.user.username ?? 'محادثة جديدة',
                            isOnline: chat.user.isOnline ?? false, // ✅ هنا
                            
                        },

                        isPinned: false,
                        createdAt: chat.createdAt,
                        updatedAt: chat.updatedAt,
                    }
                })

                console.log(data)
                this.chats = data
                this.currentChat = {}
                this.messages = []
            } catch (error) {
                console.error('Failed to fetch chats:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // اختيار دردشة
        async selectChat(chatId) {
            try {
                // إذا كانت هذه الدردشة نفس الدردشة الحالية
                if (this.currentChat?._id === chatId) return
                const chat = this.getChatById(chatId)
                if (!chat) {
                    throw new Error('Chat not found')
                }
                this.currentChat = chat
                // تحميل الرسائل للدردشة المختارة
                await this.fetchMessages(chatId)
                // تحديث الرسائل كمقروءة
                if (chat.unreadCount > 0) {
                    await this.markChatAsRead(chatId)
                }
                // الانضمام إلى غرفة الدردشة عبر Socket.IO
                socketService.joinChat(chatId)
            } catch (error) {
                console.error('Failed to select chat:', error)
                throw error
            }
        },

        // العودة إلى قائمة الدردشات
        goBackToChats() {
            this.currentChat = null
        },
        // تحميل الرسائل لدردشة معينة
        async fetchMessages(chatId) {
            try {
                socketService.joinChat(chatId)
                const response = await fetchChatMessages(chatId)
                console.log(response)
                const data = response.data.messages.map(message => ({
                    id: message._id,
                    sender: {
                        id: message.sender._id,
                        username: message.sender.username,
                    },
                    content: message.content,
                    messageType: message.messageType,
                    createdAt: message.createdAt,
                    isRead: message.isRead,
                    delivered: message.delivered,
                    deletedFor: message.deletedFor,
                    reactions: message.reactions,
                }))
                this.messages = data
                this.saveMessagesInlocal()
                this.currentChat = {
                    id: response.data.chatInfo._id,
                    participants: response.data.chatInfo.participants,
                    createdAt: response.data.chatInfo.createdAt,
                    updatedAt: response.data.chatInfo.updatedAt,
                    isGroup: response.data.chatInfo.isGroup,
                    lastMessage: response.data.chatInfo.lastMessage,
                    user: {
                        id: response.data.chatInfo.user._id,
                        username: response.data.chatInfo.user.username,
                        isOnline:response.data.chatInfo.user.isOnline
                    },
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error)
                throw error
            }
        },

        // إرسال رسالة
        async sendMessage(content) {
            if (!content.trim() || !this.currentChat) return null
            try {
                const chatId = this.currentChat.id

                const response = (await sendMessage(chatId, content)).data
                const tempMessage = {
                    id: response.data._id,
                    sender: {
                        id: response.data.sender._id,
                        username: response.data.sender.username,
                    },
                    content: response.data.content,
                    messageType: response.data.messageType,
                    createdAt: response.data.createdAt,
                    isRead: response.data.isRead,
                    delivered: response.data.delivered,
                    deletedFor: response.data.deletedFor,
                    reactions: response.data.reactions,
                }
                this.messages.push(tempMessage)
                socketService.sendMessage(tempMessage)

                // return tempMessage
            } catch (error) {
                console.error('Failed to send message:', error)
                //     throw error
            }
        },

        // إضافة رسالة محلياً
        addMessageLocally(message) {
            if (this.currentChat?._id === message.chatId) {
                this.currentChat.messages.push(message)
            }

            // تحديث في قائمة الدردشات أيضاً
            const chatIndex = this.chats.findIndex(
                c => c._id === message.chatId,
            )
            if (chatIndex !== -1) {
                this.chats[chatIndex].messages =
                    this.chats[chatIndex].messages || []
                this.chats[chatIndex].messages.push(message)
            }
        },

        // استبدال الرسالة المؤقتة
        replaceTempMessage(tempId, realMessage) {
            if (this.currentChat) {
                const index = this.currentChat.messages.findIndex(
                    m => m._id === tempId,
                )
                if (index !== -1) {
                    this.currentChat.messages[index] = realMessage
                }
            }
        },

        // تحديث آخر رسالة في الدردشة
        updateChatLastMessage(chatId, message) {
            const chatIndex = this.chats.findIndex(c => c._id === chatId)
            if (chatIndex !== -1) {
                this.chats[chatIndex].lastMessage = message

                // نقل الدردشة إلى الأعلى
                const chat = this.chats.splice(chatIndex, 1)[0]
                this.chats.unshift(chat)
            }
        },

        // تحديث حالة الرسالة إلى فاشلة
        markMessageAsFailed(messageId) {
            if (this.currentChat) {
                const message = this.currentChat.messages.find(
                    m => m._id === messageId,
                )
                if (message) {
                    message.isPending = false
                    message.isFailed = true
                }
            }
        },

        // إنشاء دردشة جديدة
        async createNewChat(participants) {
            try {
                const response = (await createChat(participants)).data
                console.log(response)
                const chat = response.data
                // إضافة الدردشة الجديدة إلى القائمة

                this.chats.unshift({
                    id: chat._id,
                    participants: chat.participants.map(user => ({
                        id: user.id,
                        name: user.username,
                    })),
                    type: chat.type,
                    title: null,
                    unreadCount: chat.unreadCount || 0,
                    lastMessage: chat.lastMessage
                        ? {
                              id: chat.lastMessage._id,
                              senderId: chat.lastMessage.sender?._id || null,
                              content: chat.lastMessage.content || '',
                              timestamp:
                                  chat.lastMessage.createdAt ||
                                  new Date().toISOString(),
                              isRead: chat.lastMessage.isRead || false,
                          }
                        : null, // إذا لم توجد رسالة بعد
                    user: {
                        id: chat.user.id,
                        username: chat.user.username,
                    },
                    isPinned: false,
                    createdAt: chat.createdAt,
                    updatedAt: chat.updatedAt || new Date().toISOString(),
                })
                return chat
            } catch (error) {
                console.error('Failed to create chat:', error)
                throw error
            }
        },
        // البحث عن مستخدمين
        async searchUsers(query) {
            try {
                console.log('Searching users with query:', query)
                const response = [
                    {
                        id: 5,
                        name: 'فاطمة أحمد',
                        status: 'متصل',
                        avatar: null,
                    },
                    {
                        id: 6,
                        name: 'يوسف عبدالله',
                        status: 'آخر ظهور: منذ ساعة',
                        avatar: null,
                    },
                ]

                //await searchUsers(query)
                this.searchResults = response
            } catch (error) {
                console.error('Failed to search users:', error)
                throw error
            }
        },

        // تسجيل الدردشة كمقروءة
        async markChatAsRead(chatId) {
            try {
                // TODO: Implement API call to mark chat as read
                // await markAsRead(chatId)

                // تحديث محلياً
                const chatIndex = this.chats.findIndex(c => c._id === chatId)
                if (chatIndex !== -1) {
                    this.chats[chatIndex].unreadCount = 0
                    this.unreadCount = this.calculateUnreadCount
                }
            } catch (error) {
                console.error('Failed to mark chat as read:', error)
                throw error
            }
        },

        // إرسال إشارة الكتابة
        async sendTyping(chatId) {
            try {
                // TODO: Implement API call to send typing indicator
                // await sendTypingIndicator(chatId)

                // تحديث محلياً
                const chatIndex = this.chats.findIndex(c => c._id === chatId)
                if (chatIndex !== -1) {
                    this.chats[chatIndex].isTyping = true

                    // إخفاء إشارة الكتابة بعد 3 ثواني
                    setTimeout(() => {
                        this.chats[chatIndex].isTyping = false
                    }, 3000)
                }
            } catch (error) {
                console.error('Failed to send typing indicator:', error)
            }
        },

        // تحديث حالة المستخدمين المتصلين
        updateOnlineUsers() {
            // يمكن تحديث هذه الوظيفة لتعكس المستخدمين المتصلين فعلياً من WebSocket
            this.onlineUsers = this.chats
                .filter(chat => chat.user.isOnline)
                .map(chat => chat.user._id)
        },

        // تحديث حالة اتصال مستخدم
        async updateUserStatus(userId, isOnline) {
            const chatIndex = this.chats.findIndex(c => c.user._id === userId)
            if (chatIndex !== -1) {
                this.chats[chatIndex].user.isOnline = isOnline

                // تحديث قائمة المستخدمين المتصلين
                if (isOnline) {
                    if (!this.onlineUsers.includes(userId)) {
                        this.onlineUsers.push(userId)
                    }
                } else {
                    this.onlineUsers = this.onlineUsers.filter(
                        id => id !== userId,
                    )
                }
            }
        },

        // استقبال رسالة جديدة (للاستخدام مع WebSocket)
        async receiveNewMessage(message) {
            const authStore = useAuthStore()
            if (message.sender == authStore.user.id) return
            this.messages.push(message)
        },
        // receiveNewMessage(message) {
        //     const chatIndex = this.chats.findIndex(
        //         c => c._id === message.chatId,
        //     )

        //     if (chatIndex !== -1) {
        //         const chat = this.chats[chatIndex]

        //         // إضافة الرسالة إلى الدردشة
        //         if (chat.messages) {
        //             chat.messages.push(message)
        //         }

        //         // تحديث آخر رسالة
        //         chat.lastMessage = message

        //         // زيادة العداد إذا لم تكن الدردشة مفتوحة
        //         if (this.currentChat?._id !== message.chatId) {
        //             chat.unreadCount++
        //             this.unreadCount = this.calculateUnreadCount
        //         }

        //         // نقل الدردشة إلى الأعلى
        //         this.chats.splice(chatIndex, 1)
        //         this.chats.unshift(chat)

        //         // إذا كانت الدردشة الحالية مفتوحة، أضف الرسالة
        //         if (this.currentChat?._id === message.chatId) {
        //             this.currentChat.messages.push(message)
        //         }
        //     }
        // },

        // حذف دردشة
        async deleteChat(chatId) {
            try {
                // استدعاء API لحذف الدردشة
                await deleteChat(chatId)

                // حذف محلياً
                const chatIndex = this.chats.findIndex(c => c.id === chatId)
                if (chatIndex !== -1) {
                    this.chats.splice(chatIndex, 1)

                    // إذا كانت هذه الدردشة هي الدردشة الحالية، ارجع للقائمة
                    if (this.currentChat?._id === chatId) {
                        this.goBackToChats()
                    }
                }
            } catch (error) {
                console.error('Failed to delete chat:', error)
                throw error
            }
        },
        async deleteMessage(messageId) {
            try {
                const messageIndex = this.messages.findIndex(
                    c => c.id === messageId,
                )
                if (messageIndex !== -1) {
                    await deleteMessage(this.currentChat.id, messageId)
                    this.messages.splice(messageIndex, 1)

                    // إذا كانت هذه الدردشة هي الدردشة الحالية، ارجع للقائمة
                    // if (this.currentChat?.id === messageIndex) {
                    //     this.goBackToChats()
                    // }
                }
            } catch (error) {
                console.error('Failed to delete chat:', error)
                throw error
            }
        },
        // مسح الرسائل في دردشة
        async clearChat(chatId) {
            try {
                // استدعاء API لمسح الرسائل
                // await clearChatMessages(chatId)

                // مسح محلياً
                const chatIndex = this.chats.findIndex(c => c._id === chatId)
                if (chatIndex !== -1) {
                    this.chats[chatIndex].messages = []
                    this.chats[chatIndex].lastMessage = null
                }

                if (this.currentChat?._id === chatId) {
                    this.currentChat.messages = []
                }
            } catch (error) {
                console.error('Failed to clear chat:', error)
                throw error
            }
        },
        async saveMessagesInlocal() {
            // الفكرة من وجوده تخفيف ظغط عل سيرفر
            if (this.messagesSaver.length === 0) {
                this.messagesSaver.push([...this.messages])
            } else {
                const current = JSON.stringify(this.messages)

                const alreadySaved = this.messagesSaver.some(
                    saved => JSON.stringify(saved) === current,
                )

                if (!alreadySaved) {
                    this.messagesSaver.push([...this.messages])
                }
            }
        },
    },
})
