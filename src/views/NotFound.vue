<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-6xl font-bold text-gray-900">404</h1>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Page not found</h2>
        <p class="mt-2 text-sm text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      <div>
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go back home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>
