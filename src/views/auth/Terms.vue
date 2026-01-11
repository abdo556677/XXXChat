<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">الشروط والأحكام</h1>
        <div class="flex items-center justify-between">
          <p class="text-gray-600">يرجى قراءة الشروط والأحكام بعناية قبل استخدام الخدمة</p>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            الإصدار {{ terms.version }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!terms.content && !error" class="flex flex-col items-center justify-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">جاري تحميل الشروط والأحكام...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">حدث خطأ في تحميل البيانات</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>تعذر تحميل الشروط والأحكام. {{ error }}</p>
              <button
                @click="loadTerms"
                class="mt-2 inline-flex items-center text-sm font-medium text-red-800 hover:text-red-900"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                حاول مرة أخرى
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Terms Content -->
      <div v-if="terms.content && !error" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Last Update Info -->
        <div class="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            آخر تحديث: {{ formatDate(terms.updatedAt) || 'غير محدد' }}
          </div>
        </div>

        <!-- Content -->
        <div class="prose prose-lg max-w-none p-6 md:p-8">
          <div 
            v-html="terms.content"
            class="terms-content text-gray-800 leading-relaxed"
          ></div>
        </div>

        <!-- Footer Actions -->
        <div class="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            
            <div class="flex space-x-3 space-x-reverse">
              <button
                @click="printTerms"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                طباعة
              </button>
              
              <button
                @click="downloadTerms"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                تحميل PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './../../stores/auth'

const authStore = useAuthStore()
const terms = ref({ 
  content: '', 
  version: '',
  updatedAt: null 
})
const error = ref(null)
const isLoading = ref(false)

const loadTerms = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const res = await authStore.getTerms()
    
    if (res.success && res.data) {
      terms.value = {
        content: res.data.content || '',
        version: res.data.version || '1.0.0',
        updatedAt: res.data.updatedAt || res.data.createdAt
      }
    } else {
      throw new Error(res.message || 'فشل في تحميل الشروط والأحكام')
    }
  } catch (err) {
    console.error('Error fetching terms:', err)
    error.value = err.message || 'حدث خطأ غير متوقع'
    terms.value = { content: '', version: '', updatedAt: null }
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const printTerms = () => {
  const printContent = `
    <html>
      <head>
        <title>الشروط والأحكام - الإصدار ${terms.value.version}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            direction: rtl;
            text-align: right;
          }
          h1 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .terms-content * { margin: 10px 0; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>الشروط والأحكام</h1>
        <div style="color: #666; margin-bottom: 20px;">
          الإصدار: ${terms.value.version}<br>
          آخر تحديث: ${formatDate(terms.value.updatedAt)}
        </div>
        <div class="terms-content">${terms.value.content}</div>
      </body>
    </html>
  `
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  printWindow.focus()
  
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

const downloadTerms = () => {
  // You can implement PDF generation here
  // For now, we'll create a downloadable HTML file
  const content = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>الشروط والأحكام - ${terms.value.version}</title>
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.8; color: #333; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #1e40af; text-align: center; margin-bottom: 30px; border-bottom: 3px solid #e5e7eb; padding-bottom: 20px; }
        .meta { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .content { margin-top: 30px; }
      </style>
    </head>
    <body>
      <h1>الشروط والأحكام</h1>
      <div class="meta">
        <strong>الإصدار:</strong> ${terms.value.version}<br>
        <strong>آخر تحديث:</strong> ${formatDate(terms.value.updatedAt)}
      </div>
      <div class="content">${terms.value.content}</div>
    </body>
    </html>
  `
  
  const blob = new Blob([content], { type: 'text/html' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `شروط-واستخدام-${terms.value.version}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// Add styles for the terms content
const style = document.createElement('style')
style.textContent = `
  .terms-content h1, .terms-content h2, .terms-content h3 {
    color: #1e40af;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  .terms-content p {
    margin-bottom: 1em;
  }
  .terms-content ul, .terms-content ol {
    margin-right: 1.5em;
    margin-bottom: 1em;
  }
  .terms-content li {
    margin-bottom: 0.5em;
  }
  .terms-content strong {
    color: #374151;
  }
  .terms-content a {
    color: #2563eb;
    text-decoration: underline;
  }
  .terms-content a:hover {
    color: #1d4ed8;
  }
`
document.head.appendChild(style)

onMounted(() => {
  loadTerms()
})
</script>