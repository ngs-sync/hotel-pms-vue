<template>
  <div>
    <!-- Mobile top bar / header with toggle menu button -->
    <div class="md:hidden flex items-center justify-between bg-gray-900 text-white px-4 py-3 shadow">
      <div class="flex items-center space-x-2">
        <span class="font-bold text-lg tracking-wide">Hotel PMS</span>
      </div>
      <button
        @click="isOpen = !isOpen"
        class="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
        aria-label="Toggle Navigation Menu"
      >
        <component :is="isOpen ? PhX : PhList" class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="isOpen = false"
    ></div>

    <!-- Sidebar container -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Sidebar Brand Header -->
      <div class="h-16 flex items-center px-6 bg-gray-950 font-bold text-xl text-white border-b border-gray-800">
        <span>Hotel PMS</span>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="isOpen = false"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="[
            $route.path === item.path
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span>{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        Hotel PMS &copy; {{ new Date().getFullYear() }}
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  PhDesk,
  PhBroom,
  PhBuilding,
  PhChartLineUp,
  PhFileX,
  PhGear,
  PhList,
  PhX
} from '@phosphor-icons/vue'

const isOpen = ref(false)

const navItems = [
  { name: 'Frontdesk', label: 'Frontdesk', path: '/', icon: PhDesk },
  { name: 'Housekeeping', label: 'Housekeeping', path: '/housekeeping', icon: PhBroom },
  { name: 'Corporate', label: 'Corporate', path: '/corporate', icon: PhBuilding },
  { name: 'Forecast', label: 'Forecast', path: '/forecast', icon: PhChartLineUp },
  { name: 'CancelList', label: 'Reports (Cancel List)', path: '/cancel-list', icon: PhFileX },
  { name: 'Settings', label: 'Settings', path: '/settings', icon: PhGear },
]
</script>
