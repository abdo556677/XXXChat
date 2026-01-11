import { defineStore } from 'pinia'
import { fetchNotifications,deleteNotification } from '@/services/notifications.service'
export const useNotificationsStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        isLoading: false,
        hasFetched: false,
    }),
    getters: {
        // عد الإشعارات غير المقروءة
        unreadNotificationsCount: state => {
            return state.notifications.filter(
                notification => notification.unread,
            ).length
        },

        // الحصول على الإشعارات غير المقروءة فقط
        unreadNotifications: state => {
            return state.notifications.filter(
                notification => notification.unread,
            )
        },

        // الحصول على الإشعارات مرتبة حسب التاريخ (الأحدث أولاً)
        sortedNotifications: state => {
            return [...state.notifications].sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp)
            })
        },

        // الحصول على الإشعارات حسب النوع
        notificationsByType: state => type => {
            return state.notifications.filter(
                notification => notification.type === type,
            )
        },
    },
    actions: {
        async markNotificationAsRead(notification) {
            try {
                // تحديث الحالة المحلية أولاً
                const notificationIndex = this.notifications.findIndex(
                    n => n.id === notification.id,
                )
                if (notificationIndex !== -1) {
                    this.notifications[notificationIndex].unread = false
                }

                // يمكنك إضافة API call هنا عندما يكون جاهزاً
                // await markNotificationAsRead(notification.id)
            } catch (error) {
                console.error('Error marking notification as read:', error)
                // يمكنك إضافة منطق استرجاع التغييرات هنا إذا لزم الأمر
            }
        },
        // علامة جديدة: وضع علامة قراءة لجميع الإشعارات
        async markAllAsRead() {
            try {
                this.notifications.forEach(notification => {
                    notification.unread = false
                })

                // API call عندما يكون جاهزاً
                // await markAllNotificationsAsRead()
            } catch (error) {
                console.error('Error marking all notifications as read:', error)
            }
        },
        async fetchNotifications() {
            // إذا تم جلب البيانات مسبقاً ولا تريد إعادة الجلب
            // if (this.hasFetched && this.notifications.length > 0) {
            //     return
            // }

            this.isLoading = true
            try {
                const response = await fetchNotifications()
                console.log(response)
                // البيانات الوهمية - يمكنك إزالتها عندما يكون لديك API
                // const mockNotifications = [
                //     {
                //         id: 1,
                //         title: 'Welcome!',
                //         message:
                //             'Welcome to our platform. Get started by completing your profile.',
                //         type: 'system',
                //         unread: false,
                //         timestamp: new Date(Date.now() - 1000 * 60 * 5),
                //         actions: [
                //             {
                //                 label: 'Complete Profile',
                //                 primary: true,
                //                 action: 'profile',
                //             },
                //         ],
                //     },
                //     {
                //         id: 2,
                //         title: 'Security Alert',
                //         message:
                //             'New login detected from a different device. Review activity.',
                //         type: 'security',
                //         unread: true,
                //         timestamp: new Date(Date.now() - 1000 * 60 * 30),
                //         actions: [
                //             {
                //                 label: 'Review',
                //                 primary: true,
                //                 action: 'review',
                //             },
                //         ],
                //     },
                //     {
                //         id: 4,
                //         title: 'New follower',
                //         message: 'Alex follow you',
                //         type: 'social',
                //         unread: true,
                //         timestamp: new Date(Date.now() - 1000 * 60 * 180),
                //         actions: [
                //             {
                //                 label: 'View Profile',
                //                 primary: true,
                //                 action: 'view',
                //             },
                //         ],
                //     },
                // ]
                const data = response.data.map(notification => ({
                    id: notification._id,
                    title: notification.title,
                    message: notification.message,
                    type: notification.type,
                    unread: notification.unread,
                    timestamp: notification.createdAt,
                }))
                this.notifications = data
                this.hasFetched = true
            } catch (error) {
                console.error('Error fetching notifications:', error)
                // يمكنك إضافة معالجة أخطاء أفضل هنا
            } finally {
                this.isLoading = false
            }
        },
        async deleteNotification(notificationId) {
            const index = this.notifications.findIndex(n => n.id === notificationId)

            if (index === -1) {
                console.warn('Notification not found:', notificationId)
                return
            }

            // احتفظ بنسخة في حال فشل الـ API
            const deletedNotification = this.notifications[index]

            // حذف محلي (Optimistic UI)
            this.notifications.splice(index, 1)

            try {
                console.log('Deleted notification with id:', notificationId)
                // API call عندما يكون جاهزاً
                await deleteNotification(notificationId)
            } catch (error) {
                // rollback
                this.notifications.splice(index, 0, deletedNotification)
                console.error('Error deleting notification:', error)
            }
        },
        async deleteAllNotifications() {
            try {
                this.notifications = []
                console.log('Deleted all notifications')
                // API call عندما يكون جاهزاً
                // await deleteAllNotifications()
            } catch (error) {
                console.error('Error deleting all notifications:', error)
            }
        },
        // علامة جديدة: إضافة إشعار جديد (مفيد للإشعارات في الوقت الحقيقي)
        addNotification(notification) {
            const newNotification = {
                ...notification,
                id: Date.now(), // إنشاء معرف فريد
                timestamp: new Date(),
                unread: true,
            }

            this.notifications.unshift(newNotification) // إضافة في البداية

            // الحد الأقصى للإشعارات المخزنة (اختياري)
            if (this.notifications.length > 50) {
                this.notifications = this.notifications.slice(0, 50)
            }
        },
        // علامة جديدة: تحديث حالة التحميل
        setLoading(loading) {
            this.isLoading = loading
        },
        // علامة جديدة: مسح جميع الإشعارات
        clearNotifications() {
            this.notifications = []
            this.hasFetched = false
        },
    },
})
