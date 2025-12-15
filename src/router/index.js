import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import MainLayout from '@/views/layouts/MainLayout.vue'
import AuthLayout from '@/views/layouts/AuthLayout.vue'

const routes = [
  {
    path: '/',
    redirect: () => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated ? '/home' : '/auth/login'
    }
  },

  // ✅ صفحات داخل AuthLayout (بدون Header)
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
    ]
  },

  // ✅ صفحات داخل MainLayout (فيها Header)
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'friends',
        name: 'Friends',
        component: () => import('@/views/Friends.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/Messages.vue'),
      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ الحماية من الدخول غير المصرح به
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // يحتاج تسجيل دخول؟
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
  }
  // مسجل بالفعل ويحاول الذهاب إلى صفحة تسجيل؟
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/home')
  } 
  else {
    next()
  }
})

export default router
