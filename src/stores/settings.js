import { defineStore } from 'pinia'
import {
  fetchSettings,
  updateSettings,
  updatePrivacySettings,
  updateNotificationSettings,
  updateSecuritySettings,
  updateAppearanceSettings,
  exportSettingsData,
  importSettingsData,
  resetSettings,
} from '@/services/settingsApi'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // 1. إعدادات الحساب
    account: {
      username: '',
      fullName: '',
      website: '',
      bio: '',
      email: '',
      phone: '',
      gender: 'prefer_not_to_say',
      isPrivate: false,
      isVerified: false,
      category: 'personal', // personal, creator, business
      similarAccountSuggestions: true,
      professionalDashboard: false,
      accountType: 'personal',
      contactOptions: {
        email: true,
        phone: false,
      },
    },

    // 2. إعدادات الخصوصية
    privacy: {
      activityStatus: true,
      showActivityStatus: true,
      readReceipts: true,
      blockedUsers: [],
      restrictedAccounts: [],
      mutedAccounts: [],
      closeFriends: [],
      storyPrivacy: 'everyone', // everyone, close_friends, selected
      postPrivacy: 'everyone', // everyone, followers, selected
      commentPrivacy: {
        allowComments: true,
        filterOffensive: true,
        manualFilter: false,
        blockedWords: [],
        allowFrom: 'everyone', // everyone, people_you_follow, your_followers
      },
      messages: {
        allowFrom: 'everyone', // everyone, people_you_follow
        messageRequests: true,
        filteredRequests: true,
        videoChats: true,
        voiceMessages: true,
      },
      tagsAndMentions: {
        allowTagging: true,
        manuallyApproveTags: false,
        allowMentions: true,
        hidePhotosOfYou: false,
      },
      accountData: {
        downloadData: false,
        deleteAccountAfter: 30, // days
      },
    },

    // 3. إعدادات الإشعارات
    notifications: {
      enabled: true,
      sounds: true,
      vibrate: true,
      emailNotifications: true,
      pushNotifications: true,
      pauseAll: false,
      pauseUntil: null,

      // أنواع الإشعارات
      types: {
        likes: {
          posts: true,
          comments: true,
          stories: true,
        },
        comments: {
          yourPosts: true,
          taggedPosts: true,
          replies: true,
          mentions: true,
        },
        follows: {
          newFollowers: true,
          followRequests: true,
          acceptedRequests: true,
        },
        messages: {
          newMessages: true,
          messageRequests: true,
          groupMessages: true,
        },
        stories: {
          reactions: true,
          shares: true,
          mentions: true,
        },
        live: {
          goingLive: true,
          reminders: true,
        },
        reminders: {
          birthdayReminders: true,
          eventReminders: true,
        },
        productUpdates: true,
        supportRequests: true,
      },
    },

    // 4. إعدادات المظهر
    appearance: {
      theme: 'light', // light, dark, system
      darkMode: false,
      language: 'ar',
      fontSize: 'medium',
      colorScheme: 'blue',
      showStoryRings: true,
      highContrast: false,
      reduceMotion: false,
      autoPlayVideos: true,
      autoPlayNextVideo: false,
      videoQuality: 'auto', // auto, low, medium, high
      imageQuality: 'high', // low, medium, high
      dataSaver: false,
    },

    // 5. إعدادات الأمان
    security: {
      twoFactorAuth: false,
      twoFactorMethod: 'app', // app, sms, email
      loginAlerts: true,
      savedLoginInfo: true,
      trustedDevices: [],
      sessionTimeout: 30, // minutes
      suspiciousLoginAlerts: true,
      reviewLoginActivity: false,
      passwordResetRequired: false,
      dataDownload: {
        requested: false,
        downloadUrl: '',
        expiresAt: null,
      },
      appPasswords: [],
    },

    // 6. إعدادات المحتوى
    content: {
      // الإعدادات المحفوظة
      savedCollections: [],
      autoSavePhotos: true,
      autoSaveVideos: false,
      autoSaveTo: 'camera_roll', // camera_roll, instagram_only

      // إعدادات المنشورات
      postDefaults: {
        addLocation: true,
        shareToFacebook: false,
        shareToTwitter: false,
        altTextAuto: true,
        hideLikesAndViews: false,
        turnOffComments: false,
      },

      // إعدادات القصص
      storyDefaults: {
        saveToArchive: true,
        shareAsPost: false,
        allowResharing: true,
        allowReplies: 'everyone', // everyone, people_you_follow, off
        showInStoryArchive: true,
      },

      // إعدادات الـ Reels
      reelDefaults: {
        saveToProfile: true,
        shareToFeed: true,
        allowRemixing: true,
        downloadReel: true,
        showOnExplore: true,
      },

      // إعدادات الـ IGTV
      igtvDefaults: {
        autoShareToFeed: true,
        previewInFeed: true,
        allowComments: true,
      },

      // الإشارات المرجعية
      bookmarks: {
        savedPosts: [],
        savedReels: [],
        savedProducts: [],
      },

      // المرشحات والملصقات المفضلة
      favorites: {
        filters: [],
        stickers: [],
        effects: [],
      },
    },

    // 7. إعدادات التطبيق
    app: {
      version: '1.0.0',
      autoUpdate: true,
      backgroundAppRefresh: true,
      cellularDataUse: {
        autoPlay: 'wifi_only', // wifi_only, always, never
        uploadQuality: 'high',
        preloadVideos: true,
      },
      storage: {
        cacheSize: '500MB',
        clearCacheAutomatically: false,
        mediaStorage: 'device', // device, cloud
      },
      accessibility: {
        screenReader: false,
        closedCaptions: false,
        visualAssistance: false,
      },
      shortcuts: {
        doubleTapToLike: true,
        swipeToArchive: true,
        pressAndHoldToPreview: true,
      },
      language: {
        primary: 'ar',
        secondary: 'en',
        translation: true,
      },
    },

    // 8. إعدادات المبيعات (للمحلات والأعمال)
    business: {
      isBusinessAccount: false,
      businessCategory: '',
      contactOptions: {
        email: '',
        phone: '',
        address: '',
        whatsapp: false,
      },
      shopSettings: {
        enableShop: false,
        currency: 'SAR',
        shippingOptions: [],
        returnPolicy: '',
      },
      insights: {
        weeklyReports: true,
        emailReports: true,
      },
      promotions: {
        autoPromote: false,
        promotionBudget: 0,
        targetAudience: {},
      },
    },

    // 9. إعدادات الاشتراكات
    subscriptions: {
      isSubscribed: false,
      subscriptionTier: 'free', // free, premium, business
      features: {
        noAds: false,
        analytics: false,
        customThemes: false,
        prioritySupport: false,
      },
      billing: {
        nextBillingDate: null,
        paymentMethod: '',
        autoRenew: true,
      },
    },

    // حالات التحميل والأخطاء
    loading: false,
    saving: false,
    error: null,

    // آخر تحديث
    lastUpdated: null,

    // النسخة الاحتياطية
    backupData: null,
  }),

  getters: {
    // الحصول على جميع الإعدادات
    getAllSettings: state => ({
      account: { ...state.account },
      privacy: { ...state.privacy },
      notifications: { ...state.notifications },
      appearance: { ...state.appearance },
      security: { ...state.security },
      content: { ...state.content },
      app: { ...state.app },
      business: { ...state.business },
      subscriptions: { ...state.subscriptions },
    }),

    // إعدادات مختصرة للعرض
    getSummary: state => ({
      accountType: state.account.category,
      isPrivate: state.account.isPrivate,
      theme: state.appearance.theme,
      language: state.appearance.language,
      notificationsEnabled: state.notifications.enabled,
      twoFactorEnabled: state.security.twoFactorAuth,
    }),

    // التحقق من إعدادات الإشعارات النشطة
    getActiveNotifications: state => {
      if (!state.notifications.enabled || state.notifications.pauseAll)
        return []

      const active = []
      Object.keys(state.notifications.types).forEach(category => {
        const categorySettings = state.notifications.types[category]
        if (typeof categorySettings === 'boolean') {
          if (categorySettings) active.push(category)
        } else {
          Object.keys(categorySettings).forEach(subType => {
            if (categorySettings[subType]) {
              active.push(`${category}.${subType}`)
            }
          })
        }
      })
      return active
    },

    // الحصول على إعدادات الخصوصية المبسطة
    getPrivacySummary: state => ({
      profileVisibility: state.account.isPrivate ? 'خاص' : 'عام',
      storyPrivacy: state.privacy.storyPrivacy,
      postPrivacy: state.privacy.postPrivacy,
      activityStatus: state.privacy.showActivityStatus ? 'مرئي' : 'مخفي',
      messagePrivacy: state.privacy.messages.allowFrom,
    }),

    // التحقق من إمكانية تنزيل البيانات
    canDownloadData: state => {
      const hasData = state.security.dataDownload.requested
      const isExpired = state.security.dataDownload.expiresAt
        ? new Date(state.security.dataDownload.expiresAt) < new Date()
        : true
      return hasData && !isExpired
    },

    // الحصول على حجم التخزين المستخدم
    getStorageUsage: state => {
      return {
        cache: state.app.storage.cacheSize,
        media: state.content.autoSaveTo === 'camera_roll' ? 'جهاز' : 'سحابة',
      }
    },

    // التحقق من وضع توفير البيانات
    isDataSaverEnabled: state => {
      return (
        state.appearance.dataSaver ||
        state.app.cellularDataUse.autoPlay === 'wifi_only' ||
        state.appearance.videoQuality === 'low'
      )
    },
  },

  actions: {
    // تهيئة الإعدادات
    async initializeSettings() {
      this.loading = true
      this.error = null

      try {
        const settings = {} //await fetchSettings()

        // تحديث جميع الإعدادات
        // Object.keys(settings.data).forEach(section => {
        //   if (this[section]) {
        //     this[section] = { ...this[section], ...settings.data[section] }
        //   }
        // })

        // this.lastUpdated = new Date().toISOString()
        // this.saveToLocalStorage()

        return settings.data
      } catch (error) {
        this.error = error.message || 'فشل في تحميل الإعدادات'
        console.error('Initialize settings failed:', error)

        // تحميل من التخزين المحلي في حالة فشل الاتصال
        this.loadFromLocalStorage()
        throw error
      } finally {
        this.loading = false
      }
    },

    // تحديث إعدادات الحساب
    async updateAccountSettings(settings) {
      this.saving = true
      this.error = null

      try {
        const response = await updateSettings({ account: settings })
        this.account = { ...this.account, ...response.data }
        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في تحديث إعدادات الحساب'
        console.error('Update account settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // تحديث إعدادات الخصوصية
    async updatePrivacySettings(settings) {
      this.saving = true
      this.error = null

      try {
        const response = await updatePrivacySettings(settings)
        this.privacy = { ...this.privacy, ...response.data }
        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في تحديث إعدادات الخصوصية'
        console.error('Update privacy settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // تحديث إعدادات الإشعارات
    async updateNotificationSettings(settings) {
      this.saving = true
      this.error = null

      try {
        const response = await updateNotificationSettings(settings)
        this.notifications = { ...this.notifications, ...response.data }
        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في تحديث إعدادات الإشعارات'
        console.error('Update notification settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // تحديث إعدادات المظهر
    async updateAppearanceSettings(settings) {
      this.saving = true
      this.error = null

      try {
        const response = await updateAppearanceSettings(settings)
        this.appearance = { ...this.appearance, ...response.data }

        // تطبيق المظهر فوراً
        this.applyAppearanceSettings()

        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في تحديث إعدادات المظهر'
        console.error('Update appearance settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // تحديث إعدادات الأمان
    async updateSecuritySettings(settings) {
      this.saving = true
      this.error = null

      try {
        const response = await updateSecuritySettings(settings)
        this.security = { ...this.security, ...response.data }
        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في تحديث إعدادات الأمان'
        console.error('Update security settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // تطبيق إعدادات المظهر
    applyAppearanceSettings() {
      // تطبيق الوضع الداكن
      const html = document.documentElement
      if (this.appearance.darkMode) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }

      // تطبيق حجم الخط
      const fontSizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px',
      }
      document.body.style.fontSize =
        fontSizeMap[this.appearance.fontSize] || '16px'

      // تطبيق توفير البيانات
      if (this.appearance.dataSaver) {
        document.body.classList.add('data-saver')
      } else {
        document.body.classList.remove('data-saver')
      }
    },

    // إضافة مستخدم إلى المحظورين
    addBlockedUser(user) {
      if (!this.privacy.blockedUsers.some(u => u.id === user.id)) {
        this.privacy.blockedUsers.push(user)
        this.saveToLocalStorage()
      }
    },

    // إزالة مستخدم من المحظورين
    removeBlockedUser(userId) {
      this.privacy.blockedUsers = this.privacy.blockedUsers.filter(
        u => u.id !== userId,
      )
      this.saveToLocalStorage()
    },

    // إضافة مستخدم إلى القائمة المقيدة
    addRestrictedUser(user) {
      if (!this.privacy.restrictedAccounts.some(u => u.id === user.id)) {
        this.privacy.restrictedAccounts.push(user)
        this.saveToLocalStorage()
      }
    },

    // إضافة صديق مقرب
    addCloseFriend(user) {
      if (!this.privacy.closeFriends.some(u => u.id === user.id)) {
        this.privacy.closeFriends.push(user)
        this.saveToLocalStorage()
      }
    },

    // حفظ المحتوى
    saveToCollection(collectionName, item) {
      const collection = this.content.savedCollections.find(
        c => c.name === collectionName,
      )
      if (collection) {
        if (!collection.items.some(i => i.id === item.id)) {
          collection.items.push(item)
        }
      } else {
        this.content.savedCollections.push({
          name: collectionName,
          items: [item],
        })
      }
      this.saveToLocalStorage()
    },

    // طلب تنزيل بيانات الحساب
    async requestDataDownload() {
      this.saving = true
      this.error = null

      try {
        const response = await exportSettingsData()
        this.security.dataDownload = {
          requested: true,
          downloadUrl: response.data.downloadUrl,
          expiresAt: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 يوم
        }
        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في طلب تنزيل البيانات'
        console.error('Request data download failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // استيراد الإعدادات
    async importSettings(file) {
      this.saving = true
      this.error = null

      try {
        const response = await importSettingsData(file)

        // استيراد البيانات مع الاحتفاظ بالإعدادات المهمة
        const importedData = response.data

        Object.keys(importedData).forEach(section => {
          if (this[section] && section !== 'security') {
            // لا نستورد إعدادات الأمان
            this[section] = { ...this[section], ...importedData[section] }
          }
        })

        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        this.applyAppearanceSettings()

        return response.data
      } catch (error) {
        this.error = error.message || 'فشل في استيراد الإعدادات'
        console.error('Import settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // إعادة تعيين الإعدادات
    async resetAllSettings() {
      this.saving = true
      this.error = null

      try {
        await resetSettings()

        // إعادة التعيين للقيم الافتراضية مع الاحتفاظ ببعض الإعدادات
        const defaultSettings = {
          account: {
            ...this.account,
            isPrivate: false,
            similarAccountSuggestions: true,
          },
          privacy: {
            ...this.privacy,
            activityStatus: true,
            storyPrivacy: 'everyone',
            postPrivacy: 'everyone',
          },
          notifications: {
            ...this.notifications,
            enabled: true,
            pauseAll: false,
          },
          appearance: {
            ...this.appearance,
            theme: 'light',
            darkMode: false,
            dataSaver: false,
          },
          content: {
            ...this.content,
            autoSavePhotos: true,
          },
        }

        Object.keys(defaultSettings).forEach(section => {
          if (this[section]) {
            this[section] = defaultSettings[section]
          }
        })

        this.lastUpdated = new Date().toISOString()
        this.saveToLocalStorage()
        this.applyAppearanceSettings()

        return { success: true }
      } catch (error) {
        this.error = error.message || 'فشل في إعادة تعيين الإعدادات'
        console.error('Reset settings failed:', error)
        throw error
      } finally {
        this.saving = false
      }
    },

    // التبديل بين وضع الحساب الشخصي والتجاري
    toggleAccountType() {
      this.account.category =
        this.account.category === 'personal' ? 'business' : 'personal'
      this.business.isBusinessAccount = this.account.category === 'business'
      this.saveToLocalStorage()
    },

    // حفظ في التخزين المحلي
    saveToLocalStorage() {
      try {
        localStorage.setItem(
          'instagram_settings',
          JSON.stringify(this.getAllSettings),
        )
        localStorage.setItem('settings_last_updated', this.lastUpdated)
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error)
      }
    },

    // تحميل من التخزين المحلي
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('instagram_settings')
        const lastUpdated = localStorage.getItem('settings_last_updated')

        if (saved) {
          const parsed = JSON.parse(saved)
          Object.keys(parsed).forEach(section => {
            if (this[section]) {
              this[section] = { ...this[section], ...parsed[section] }
            }
          })

          this.lastUpdated = lastUpdated || new Date().toISOString()
          this.applyAppearanceSettings()
        }
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error)
      }
    },

    // إنشاء نسخة احتياطية
    createBackup() {
      this.backupData = JSON.parse(JSON.stringify(this.getAllSettings))
      return this.backupData
    },

    // استعادة من النسخة الاحتياطية
    restoreFromBackup() {
      if (this.backupData) {
        Object.keys(this.backupData).forEach(section => {
          if (this[section]) {
            this[section] = this.backupData[section]
          }
        })
        this.saveToLocalStorage()
        this.applyAppearanceSettings()
        return true
      }
      return false
    },

    // مسح بيانات التخزين المؤقت
    clearCache() {
      this.app.storage.cacheSize = '0MB'
      this.saveToLocalStorage()
    },

    // الحصول على تقرير الإعدادات
    getSettingsReport() {
      return {
        summary: this.getSummary,
        privacy: this.getPrivacySummary,
        storage: this.getStorageUsage,
        lastUpdated: this.lastUpdated,
        dataSaverEnabled: this.isDataSaverEnabled,
        activeNotifications: this.getActiveNotifications.length,
        blockedUsersCount: this.privacy.blockedUsers.length,
        closeFriendsCount: this.privacy.closeFriends.length,
        savedCollectionsCount: this.content.savedCollections.length,
      }
    },
  },

  // المثبت لتشغيل التخزين المحلي تلقائياً
  setup() {
    this.loadFromLocalStorage()
    this.applyAppearanceSettings()
  },
})
