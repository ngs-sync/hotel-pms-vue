<template>
  <div id="app" class="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row">
    <AppSidebar />
    <main class="flex-1 overflow-y-auto min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './components/common/AppSidebar.vue'
</script>
