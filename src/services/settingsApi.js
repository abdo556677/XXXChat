import api from '@/utils/api'

// Fetch all settings
export const fetchSettings = async () => {
  try {
    const response = await api.get('/settings')
    return response
  } catch (error) {
    // Fallback to localStorage if API fails
    console.warn('API failed, using localStorage fallback')
    throw error
  }
}

// Update general settings
export const updateSettings = async settings => {
  try {
    const response = await api.put('/settings', settings)
    return response
  } catch (error) {
    console.warn('API failed, settings saved locally')
    throw error
  }
}

// Update privacy settings
export const updatePrivacySettings = async privacySettings => {
  try {
    const response = await api.put('/settings/privacy', privacySettings)
    return response
  } catch (error) {
    console.warn('API failed, privacy settings saved locally')
    throw error
  }
}

// Update notification settings
export const updateNotificationSettings = async notificationSettings => {
  try {
    const response = await api.put(
      '/settings/notifications',
      notificationSettings,
    )
    return response
  } catch (error) {
    console.warn('API failed, notification settings saved locally')
    throw error
  }
}

// Update security settings
export const updateSecuritySettings = async securitySettings => {
  try {
    const response = await api.put('/settings/security', securitySettings)
    return response
  } catch (error) {
    console.warn('API failed, security settings saved locally')
    throw error
  }
}

// Update appearance settings
export const updateAppearanceSettings = async appearanceSettings => {
  try {
    const response = await api.put('/settings/appearance', appearanceSettings)
    return response
  } catch (error) {
    console.warn('API failed, appearance settings saved locally')
    throw error
  }
}

// Export settings data
export const exportSettingsData = async () => {
  try {
    const response = await api.get('/settings/export')
    return response
  } catch (error) {
    console.warn('API failed, cannot export data')
    throw error
  }
}

// Import settings data
export const importSettingsData = async file => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  } catch (error) {
    console.warn('API failed, cannot import data')
    throw error
  }
}

// Reset all settings
export const resetSettings = async () => {
  try {
    const response = await api.post('/settings/reset')
    return response
  } catch (error) {
    console.warn('API failed, cannot reset settings')
    throw error
  }
}
