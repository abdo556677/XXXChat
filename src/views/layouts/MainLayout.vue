<template>
  <div id="app" class="min-h-screen bg-gray-200 flex flex-col">
    <Header/>
    <main class="flex-1 ">
      <div class="container mx-auto flex gap-4 p-4 h-full">
        <AsideLeft />
        <router-view />
        <AsideRigth />
      </div>
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
import AsideRigth from '@/components/AsideRigth.vue'
import AsideLeft from '@/components/AsideLeft.vue'


</script>

<style>
/* Add global styles if needed */
</style>
