<template>
    <main
        class="flex-1 rounded-2xl p-6 overflow-y-auto transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800"
        style="max-height: calc(100vh - 5rem); min-height: calc(100vh - 5rem)"
    >
        <div class="h-full" ref="feedEl">
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between mb-2">
                    <div>
                        <h1
                            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                        >
                            الإعدادات
                        </h1>
                        <p class="text-gray-600 dark:text-gray-400 mt-2">
                            إدارة إعدادات حسابك وتخصيص تجربتك
                        </p>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                        @click="activeTab = 'appearance'"
                        :class="[
                            'p-4 rounded-xl border transition-all duration-300 flex items-center gap-3',
                            activeTab === 'appearance'
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700',
                        ]"
                    >
                        <Palette
                            class="w-5 h-5 text-blue-600 dark:text-blue-400"
                        />
                        <span class="font-medium text-gray-900 dark:text-white"
                            >المظهر</span
                        >
                    </button>

                    <button
                        @click="activeTab = 'privacy'"
                        :class="[
                            'p-4 rounded-xl border transition-all duration-300 flex items-center gap-3',
                            activeTab === 'privacy'
                                ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700',
                        ]"
                    >
                        <Shield
                            class="w-5 h-5 text-green-600 dark:text-green-400"
                        />
                        <span class="font-medium text-gray-900 dark:text-white"
                            >الخصوصية</span
                        >
                    </button>

                    <button
                        @click="activeTab = 'notifications'"
                        :class="[
                            'p-4 rounded-xl border transition-all duration-300 flex items-center gap-3',
                            activeTab === 'notifications'
                                ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-800'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-700',
                        ]"
                    >
                        <Bell
                            class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                        />
                        <span class="font-medium text-gray-900 dark:text-white"
                            >الإشعارات</span
                        >
                    </button>
                </div>

                <!-- Main Settings Card -->
                <div
                    class="  rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                    <!-- Tab Navigation -->
                    <div class="border-b border-gray-100 dark:border-gray-700">
                        <div class="flex overflow-x-auto">
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                @click="activeTab = tab.id"
                                :class="[
                                    'px-6 py-4 font-medium whitespace-nowrap transition-all duration-300 border-b-2 flex items-center gap-2',
                                    activeTab === tab.id
                                        ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-300',
                                ]"
                            >
                                <component :is="tab.icon" class="w-5 h-5" />
                                {{ tab.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- المظهر -->
                        <div
                            v-if="activeTab === 'appearance'"
                            class="space-y-6"
                        >
                            <!-- Dark Mode Toggle -->
                            <div
                                class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-blue-900/20 rounded-xl border border-gray-100 dark:border-gray-700"
                            >
                                <div class="flex items-center gap-4">
                                    <div
                                        class="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md"
                                    >
                                        <Moon class="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3
                                            class="text-lg font-semibold text-gray-900 dark:text-white"
                                        >
                                            الوضع الداكن
                                        </h3>
                                        <p
                                            class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                        >
                                            تبديل بين الوضع الفاتح والداكن
                                        </p>
                                    </div>
                                </div>
                                <label
                                    class="relative inline-flex items-center cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        v-model="
                                            settingStore.appearance.darkMode
                                        "
                                        @change="
                                            settingStore.applyAppearanceSettings()
                                        "
                                        class="sr-only peer"
                                    />
                                    <div
                                        class="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-purple-600"
                                    ></div>
                                </label>
                            </div>

                            <!-- Theme Colors -->
                            <div class="space-y-4">
                                <h3
                                    class="text-lg font-semibold text-gray-900 dark:text-white"
                                >
                                    ألوان السمة
                                </h3>
                                <div class="flex gap-3 flex-wrap">
                                    <button
                                        v-for="color in themeColors"
                                        :key="color.name"
                                        @click="setThemeColor(color.value)"
                                        :class="[
                                            'w-10 h-10 rounded-full border-2 transition-all hover:scale-110',
                                            settingStore.appearance
                                                .colorScheme === color.value
                                                ? 'border-blue-500 dark:border-blue-400 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-600',
                                        ]"
                                        :style="{
                                            backgroundColor: color.value,
                                        }"
                                        :title="color.name"
                                    >
                                        <Check
                                            v-if="
                                                settingStore.appearance
                                                    .colorScheme === color.value
                                            "
                                            class="w-5 h-5 mx-auto text-white"
                                        />
                                    </button>
                                </div>
                            </div>

                            <!-- Additional Appearance Settings -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label
                                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        حجم الخط
                                    </label>
                                    <select
                                        v-model="
                                            settingStore.appearance.fontSize
                                        "
                                        class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                    >
                                        <option value="small">صغير</option>
                                        <option value="medium">متوسط</option>
                                        <option value="large">كبير</option>
                                    </select>
                                </div>

                                <div class="space-y-2">
                                    <label
                                        class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        لغة الواجهة
                                    </label>
                                    <select
                                        v-model="
                                            settingStore.appearance.language
                                        "
                                        class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                    >
                                        <option value="ar">العربية</option>
                                        <option value="en">English</option>
                                        <option value="fr">Français</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- الخصوصية -->
                        <div v-if="activeTab === 'privacy'" class="space-y-6">
                            <div class="space-y-4">
                                <div
                                    class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50/30 dark:from-gray-800/50 dark:to-green-900/20 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md"
                                        >
                                            <Eye class="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3
                                                class="text-lg font-semibold text-gray-900 dark:text-white"
                                            >
                                                إظهار حالة النشاط
                                            </h3>
                                            <p
                                                class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                            >
                                                السماح للأصدقاء برؤية متى كنت
                                                متصلاً آخر مرة
                                            </p>
                                        </div>
                                    </div>
                                    <label
                                        class="relative inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            v-model="
                                                settingStore.privacy
                                                    .showActivityStatus
                                            "
                                            class="sr-only peer"
                                        />
                                        <div
                                            class="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-emerald-600"
                                        ></div>
                                    </label>
                                </div>

                                <div
                                    class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50/30 dark:from-gray-800/50 dark:to-green-900/20 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md"
                                        >
                                            <Users class="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3
                                                class="text-lg font-semibold text-gray-900 dark:text-white"
                                            >
                                                الحساب الخاص
                                            </h3>
                                            <p
                                                class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                            >
                                                الموافقة على متابعين جدد يدوياً
                                            </p>
                                        </div>
                                    </div>
                                    <label
                                        class="relative inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            v-model="
                                                settingStore.account.isPrivate
                                            "
                                            class="sr-only peer"
                                        />
                                        <div
                                            class="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-green-600 peer-checked:to-emerald-600"
                                        ></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- الإشعارات -->
                        <div
                            v-if="activeTab === 'notifications'"
                            class="space-y-6"
                        >
                            <div class="space-y-4">
                                <div
                                    class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-yellow-50/30 dark:from-gray-800/50 dark:to-yellow-900/20 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-md"
                                        >
                                            <Bell class="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3
                                                class="text-lg font-semibold text-gray-900 dark:text-white"
                                            >
                                                الإشعارات الفورية
                                            </h3>
                                            <p
                                                class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                            >
                                                استقبال إشعارات فورية على الجهاز
                                            </p>
                                        </div>
                                    </div>
                                    <label
                                        class="relative inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            v-model="
                                                settingStore.notifications
                                                    .pushNotifications
                                            "
                                            class="sr-only peer"
                                        />
                                        <div
                                            class="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-yellow-600 peer-checked:to-amber-600"
                                        ></div>
                                    </label>
                                </div>

                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div class="space-y-4">
                                        <h4
                                            class="font-medium text-gray-900 dark:text-white"
                                        >
                                            إشعارات المنشورات
                                        </h4>
                                        <div class="space-y-3">
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <span
                                                    class="text-sm text-gray-600 dark:text-gray-400"
                                                    >الإعجابات</span
                                                >
                                                <label
                                                    class="relative inline-flex items-center cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        v-model="
                                                            settingStore
                                                                .notifications
                                                                .postLikes
                                                        "
                                                        class="sr-only peer"
                                                    />
                                                    <div
                                                        class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"
                                                    ></div>
                                                </label>
                                            </div>
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <span
                                                    class="text-sm text-gray-600 dark:text-gray-400"
                                                    >التعليقات</span
                                                >
                                                <label
                                                    class="relative inline-flex items-center cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        v-model="
                                                            settingStore
                                                                .notifications
                                                                .postComments
                                                        "
                                                        class="sr-only peer"
                                                    />
                                                    <div
                                                        class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"
                                                    ></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-4">
                                        <h4
                                            class="font-medium text-gray-900 dark:text-white"
                                        >
                                            إشعارات الرسائل
                                        </h4>
                                        <div class="space-y-3">
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <span
                                                    class="text-sm text-gray-600 dark:text-gray-400"
                                                    >رسائل جديدة</span
                                                >
                                                <label
                                                    class="relative inline-flex items-center cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        v-model="
                                                            settingStore
                                                                .notifications
                                                                .newMessages
                                                        "
                                                        class="sr-only peer"
                                                    />
                                                    <div
                                                        class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"
                                                    ></div>
                                                </label>
                                            </div>
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <span
                                                    class="text-sm text-gray-600 dark:text-gray-400"
                                                    >طلبات الرسائل</span
                                                >
                                                <label
                                                    class="relative inline-flex items-center cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        v-model="
                                                            settingStore
                                                                .notifications
                                                                .messageRequests
                                                        "
                                                        class="sr-only peer"
                                                    />
                                                    <div
                                                        class="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"
                                                    ></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- الحساب -->
                        <div v-if="activeTab === 'account'" class="space-y-6">
                            <div class="space-y-4">
                                <!-- Profile Information -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white"
                                    >
                                        معلومات الملف الشخصي
                                    </h3>
                                    <div
                                        class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div class="space-y-2">
                                            <label
                                                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                الاسم الكامل
                                            </label>
                                            <input
                                                type="text"
                                                v-model="
                                                    settingStore.account
                                                        .fullName
                                                "
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                placeholder="أدخل اسمك الكامل"
                                            />
                                        </div>
                                        <div class="space-y-2">
                                            <label
                                                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                البريد الإلكتروني
                                            </label>
                                            <input
                                                type="email"
                                                v-model="
                                                    settingStore.account.email
                                                "
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                placeholder="أدخل بريدك الإلكتروني"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <!-- Change Password -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white"
                                    >
                                        تغيير كلمة المرور
                                    </h3>
                                    <div class="space-y-3">
                                        <div class="space-y-2">
                                            <label
                                                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                كلمة المرور الحالية
                                            </label>
                                            <input
                                                type="password"
                                                v-model="currentPassword"
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                placeholder="أدخل كلمة المرور الحالية"
                                            />
                                        </div>
                                        <div class="space-y-2">
                                            <label
                                                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                كلمة المرور الجديدة
                                            </label>
                                            <input
                                                type="password"
                                                v-model="newPassword"
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                placeholder="أدخل كلمة المرور الجديدة"
                                            />
                                        </div>
                                        <div class="space-y-2">
                                            <label
                                                class="text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                تأكيد كلمة المرور الجديدة
                                            </label>
                                            <input
                                                type="password"
                                                v-model="confirmPassword"
                                                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                                                placeholder="أعد إدخال كلمة المرور الجديدة"
                                            />
                                        </div>
                                        <button
                                            @click="changePassword"
                                            class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                                        >
                                            تغيير كلمة المرور
                                        </button>
                                    </div>
                                </div>

                                <!-- Danger Zone -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-lg font-semibold text-red-600 dark:text-red-400"
                                    >
                                        منطقة الخطر
                                    </h3>
                                    <div
                                        class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                                    >
                                        <h4
                                            class="font-medium text-red-900 dark:text-red-100 mb-2"
                                        >
                                            حذف الحساب
                                        </h4>
                                        <p
                                            class="text-sm text-red-700 dark:text-red-300 mb-4"
                                        >
                                            سيتم حذف حسابك نهائياً وجميع
                                            البيانات المرتبطة به. هذا الإجراء لا
                                            يمكن التراجع عنه.
                                        </p>
                                        <button
                                            @click="deleteAccount"
                                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            حذف الحساب
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- الأمان -->
                        <div v-if="activeTab === 'security'" class="space-y-6">
                            <div class="space-y-4">
                                <!-- Two-Factor Authentication -->
                                <div
                                    class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-red-50/30 dark:from-gray-800/50 dark:to-red-900/20 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-md"
                                        >
                                            <Lock class="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3
                                                class="text-lg font-semibold text-gray-900 dark:text-white"
                                            >
                                                المصادقة الثنائية
                                            </h3>
                                            <p
                                                class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                            >
                                                إضافة طبقة أمان إضافية لحسابك
                                            </p>
                                        </div>
                                    </div>
                                    <label
                                        class="relative inline-flex items-center cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            v-model="
                                                settingStore.security
                                                    .twoFactorEnabled
                                            "
                                            class="sr-only peer"
                                        />
                                        <div
                                            class="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-lg peer-checked:bg-gradient-to-r peer-checked:from-red-600 peer-checked:to-pink-600"
                                        ></div>
                                    </label>
                                </div>

                                <!-- Login Sessions -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white"
                                    >
                                        جلسات الدخول
                                    </h3>
                                    <div
                                        class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                                    >
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <div>
                                                <h4
                                                    class="font-medium text-gray-900 dark:text-white"
                                                >
                                                    إدارة جلسات الدخول
                                                </h4>
                                                <p
                                                    class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                                >
                                                    عرض وإدارة جميع الأجهزة
                                                    المتصلة
                                                </p>
                                            </div>
                                            <button
                                                @click="viewAllSessions"
                                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                عرض الجلسات
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Security Log -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white"
                                    >
                                        سجل الأمان
                                    </h3>
                                    <div
                                        class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                                    >
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <div>
                                                <h4
                                                    class="font-medium text-gray-900 dark:text-white"
                                                >
                                                    نشاط الحساب
                                                </h4>
                                                <p
                                                    class="text-sm text-gray-600 dark:text-gray-400 mt-1"
                                                >
                                                    عرض سجل الأنشطة الأمنية
                                                </p>
                                            </div>
                                            <button
                                                @click="viewSecurityLog"
                                                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                            >
                                                عرض السجل
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Reset Two-Factor -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-lg font-semibold text-gray-900 dark:text-white"
                                    >
                                        إعادة تعيين المصادقة الثنائية
                                    </h3>
                                    <div
                                        class="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl"
                                    >
                                        <h4
                                            class="font-medium text-yellow-900 dark:text-yellow-100 mb-2"
                                        >
                                            إعادة تعيين المصادقة الثنائية
                                        </h4>
                                        <p
                                            class="text-sm text-yellow-700 dark:text-yellow-300 mb-4"
                                        >
                                            سيتم إلغاء تفعيل المصادقة الثنائية
                                            وستحتاج إلى إعدادها مرة أخرى.
                                        </p>
                                        <button
                                            @click="resetTwoFactor"
                                            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
                                        >
                                            إعادة التعيين
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- المحتوى -->
                        <div v-if="activeTab === 'content'" class="space-y-6">
                            <!-- Content settings content -->
                        </div>
                    </div>
                </div>

                <!-- Bottom Actions -->
                <div class="flex justify-end gap-3 pt-4">
                    <button
                        @click="resetSettings"
                        class="px-5 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 font-medium"
                    >
                        إعادة تعيين
                    </button>
                    <button
                        @click="saveSettings"
                        class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium flex items-center gap-2"
                    >
                        <Save class="w-4 h-4" />
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from 'vue-toastification'
import {
    Palette,
    Shield,
    Bell,
    User,
    Lock,
    FileText,
    Moon,
    Eye,
    Users,
    Check,
    Save,
} from 'lucide-vue-next'

const settingStore = useSettingsStore()
const toast = useToast()
const activeTab = ref('appearance')

// Account settings
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// No local settings state needed, using store directly

// Theme colors
const themeColors = ref([
    { name: 'أزرق', value: '#3b82f6' },
    { name: 'أرجواني', value: '#8b5cf6' },
    { name: 'وردي', value: '#ec4899' },
    { name: 'برتقالي', value: '#f97316' },
    { name: 'أخضر', value: '#10b981' },
    { name: 'أحمر', value: '#ef4444' },
])

// Tabs configuration
const tabs = ref([
    { id: 'appearance', name: 'المظهر', icon: Palette },
    { id: 'privacy', name: 'الخصوصية', icon: Shield },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'account', name: 'الحساب', icon: User },
    { id: 'security', name: 'الأمان', icon: Lock },
    { id: 'content', name: 'المحتوى', icon: FileText },
])

// Methods
const setThemeColor = async color => {
    try {
        await settingStore.updateAppearanceSettings({ colorScheme: color })
        document.documentElement.style.setProperty('--primary-color', color)
        toast.success('تم تغيير لون السمة')
    } catch {
        toast.error('حدث خطأ أثناء تغيير اللون')
    }
}

const saveSettings = async () => {
    try {
        await settingStore.updateAppearanceSettings()
        await settingStore.updatePrivacySettings()
        await settingStore.updateNotificationSettings()
        toast.success('تم حفظ الإعدادات بنجاح')
    } catch {
        toast.error('حدث خطأ أثناء حفظ الإعدادات')
    }
}

const resetSettings = async () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
        try {
            await settingStore.resetAllSettings()
            document.documentElement.style.setProperty(
                '--primary-color',
                '#3b82f6',
            )
            toast.info('تم إعادة تعيين الإعدادات')
        } catch {
            toast.error('حدث خطأ أثناء إعادة التعيين')
        }
    }
}

const changePassword = async () => {
    if (
        !currentPassword.value ||
        !newPassword.value ||
        !confirmPassword.value
    ) {
        toast.error('يرجى ملء جميع الحقول')
        return
    }
    if (newPassword.value !== confirmPassword.value) {
        toast.error('كلمة المرور الجديدة غير متطابقة')
        return
    }
    try {
        await settingStore.changePassword(
            currentPassword.value,
            newPassword.value,
        )
        currentPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
        toast.success('تم تغيير كلمة المرور بنجاح')
    } catch {
        toast.error('حدث خطأ أثناء تغيير كلمة المرور')
    }
}

const deleteAccount = async () => {
    if (
        confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')
    ) {
        try {
            await settingStore.deleteAccount()
            toast.success('تم حذف الحساب بنجاح')
            // Redirect to login or home page
        } catch {
            toast.error('حدث خطأ أثناء حذف الحساب')
        }
    }
}

const viewAllSessions = () => {
    toast.info('عرض جميع جلسات الدخول - هذه الميزة قيد التطوير')
}

const viewSecurityLog = () => {
    toast.info('عرض سجل الأمان - هذه الميزة قيد التطوير')
}

const resetTwoFactor = async () => {
    if (confirm('هل أنت متأكد من إعادة تعيين المصادقة الثنائية؟')) {
        try {
            await settingStore.resetTwoFactor()
            toast.success('تم إعادة تعيين المصادقة الثنائية')
        } catch {
            toast.error('حدث خطأ أثناء إعادة التعيين')
        }
    }
}

// Load saved settings on mount
onMounted(() => {
    // const savedAppearance = localStorage.getItem('appearanceSettings')
    // const savedPrivacy = localStorage.getItem('privacySettings')
    // const savedNotifications = localStorage.getItem('notificationSettings')
    // const savedThemeColor = localStorage.getItem('themeColor')
    // if (savedAppearance) appearanceSettings.value = JSON.parse(savedAppearance)
    // if (savedPrivacy) privacySettings.value = JSON.parse(savedPrivacy)
    // if (savedNotifications) notificationSettings.value = JSON.parse(savedNotifications)
    // if (savedThemeColor) {
    //   currentThemeColor.value = savedThemeColor
    //   document.documentElement.style.setProperty('--primary-color', savedThemeColor)
    // }
})

// Watch for dark mode changes
// watch(() => settingStore.darkmode, (newVal) => {
//   appearanceSettings.value.themeMode = newVal ? 'dark' : 'light'
// })
</script>

<style scoped>
/* Custom scrollbar for tab navigation */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* Smooth transitions */
* {
    transition:
        background-color 0.3s ease,
        border-color 0.3s ease,
        transform 0.3s ease;
}

/* Gradient borders */
.gradient-border {
    position: relative;
    border: double 2px transparent;
    background-image: linear-gradient(white, white),
        linear-gradient(to right, #3b82f6, #8b5cf6);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}
</style>
