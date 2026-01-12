import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import MainLayout from '@/views/core/MainLayout.vue'
import AuthLayout from '@/views/core/AuthLayout.vue'

const routes = [
    {
        path: '/',
        redirect: () => {
            const authStore = useAuthStore()
            return authStore.isAuthenticated ? '/home' : '/auth/login'
        },
    },

    {
        path: '/auth',
        component: AuthLayout,
        meta: { requiresGuest: true },
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/auth/Login.vue'),
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('@/views/auth/Register.vue'),
            },
            {
                path: 'terms',
                name: 'Terms',
                component: () => import('@/views/auth/Terms.vue'),
            },
        ],
    },

    {
        path: '/',
        component: MainLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('@/views/client/home/Home.vue'),
            },
            {
                path: 'saved',
                name: 'Saved',
                component: () => import('@/views/client/saved/saved.vue'),
            },
            {
                path: 'home/:id',
                name: 'Home > post',
                component: () => import('@/views/client/home/postShow.vue'),
            },
            {
                path: 'profile/:id',
                name: 'Profile',
                component: () => import('@/views/client/profile/profile.vue'),
            },
            {
                path: 'users',
                name: 'Users',
                component: () => import('@/views/client/users/users.vue'),
            },
            {
                path: 'chat',
                name: 'chat',
                component: () => import('@/views/client/chat/chat.vue'),
            },
            {
                path: 'chat/:id',
                name: 'chat v',
                component: () => import('@/views/client/chat/showChat.vue'),
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/client/settings/settings.vue'),
            },
            {
                path: 'search',
                name: 'Search',
                component: () =>
                    import('@/views/client/search/SearchResults.vue'),
            },
            {
                path: 'notifications',
                name: 'notifications',
                component: () =>
                    import('@/views/client/notification/notification.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// ✅ الحماية من الدخول غير المصرح به
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // إذا لم تكن حالة authStore محددة بعد
    if (!authStore.user) {
        try {
            await authStore.fetchUser() // جلب بيانات المستخدم من السيرفر
        } catch (err) {
            console.error('Error fetching user during route guard:', err)
        }
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/auth/login')
    } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/home')
    } else {
        next()
    }
})

export default router
