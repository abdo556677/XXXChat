<template>
    <div
        class="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
        <div
            class="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
            <div class="px-8 py-12">
                <div class="text-center mb-8">
                    <div
                        class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4"
                    >
                        <svg
                            class="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            ></path>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">
                        Join SocialMedio
                    </h1>
                    <p class="text-gray-600">
                        Create your account and start connecting
                    </p>
                </div>

                <form class="space-y-6" @submit.prevent="handleRegister">
                    <div>
                        <label
                            for="username"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Username</label
                        >
                        <div class="relative">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autocomplete="username"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 pl-12"
                                placeholder="Choose a username"
                                v-model="form.username"
                            />
                            <svg
                                class="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Email Address</label
                        >
                        <div class="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 pl-12"
                                placeholder="Enter your email"
                                v-model="form.email"
                            />
                            <svg
                                class="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >Password</label
                        >
                        <div class="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autocomplete="new-password"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 pl-12"
                                placeholder="Create a password"
                                v-model="form.password"
                            />
                            <svg
                                class="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700 mb-2"
                            >confirm Password</label
                        >
                        <div class="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autocomplete="confirm-Password"
                                required
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 pl-12"
                                placeholder="confirm a Password"
                                v-model="form.confirmPassword"
                            />
                            <svg
                                class="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                    <!-- Accept Terms Checkbox -->
                    <div class="flex items-center mb-4">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            v-model="form.acceptTerms"
                            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                            for="acceptTerms"
                            class="ml-2 block text-sm text-gray-700"
                        >
                            I accept the
                            <router-link
                                to="/auth/terms"
                                class="text-green-600 hover:text-green-500 underline"
                            >
                                Terms & Conditions
                            </router-link>
                        </label>
                    </div>

                    <div>
                        <button
                            type="submit"
                            :disabled="loading.value"
                            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition hover:scale-105 duration-200"
                        >
                            <span v-if="loading.value" class="flex items-center">
                                <svg
                                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Creating account...
                            </span>
                            <span v-else class="flex items-center">
                                <svg
                                    class="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    ></path>
                                </svg>
                                Create Account
                            </span>
                        </button>
                    </div>
                </form>

                <div class="mt-8 text-center">
                    <p class="text-sm text-gray-600">
                        Already have an account?
                        <router-link
                            to="/auth/login"
                            class="font-medium text-green-600 hover:text-green-500 transition-colors duration-200"
                        >
                            Sign in here
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const loading = reactive({ value: false })
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const errors = reactive({}) // لتخزين رسائل الخطأ

// الفورم مع acceptTerms
const form = reactive({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false, // ← هذا الحقل الجديد
})


// الدالة للتسجيل
const handleRegister = async () => {
    // تحقق من موافقة الشروط قبل الإرسال
    if (!form.acceptTerms) {
        errors.acceptTerms = 'يجب الموافقة على الشروط والأحكام'
        return
    } else {
        errors.acceptTerms = null
    }

    loading.value = true

    try {
        const response = await authStore.register(form)
        if (response && response.success) {
            toast.success('Registration successful! Please log in.')
            router.push('/auth/login')
        } else {
            throw new Error(response?.message || 'Registration failed')
        }
    } catch (error) {
        console.log(error)
        toast.error(
            error.response?.data?.message ||
                error.message ||
                'Registration failed',
        )
    } finally {
        loading.value = false
    }
}
</script>
