<template>
  <div id="app" class="min-h-screen bg-gray-200 flex flex-col dark:bg-gray-900">
    <AppHeader/>
    <main class="">
      <div class="container mx-auto flex gap-2 p-1 ">
        <AsideLeft />
        <router-view />
        <AsideRigth />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '@/views/layouts/AppHeader.vue'
import AsideRigth from '@/views/layouts/AsideRigth.vue'
import AsideLeft from '@/views/layouts/AsideLeft.vue'


</script>

<style>
/* Add global styles if needed */
</style>
