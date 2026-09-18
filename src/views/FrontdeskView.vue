<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header & View Switcher -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Frontdesk Operations</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
          Real-time room allocation matrix calendar, arrival/departure lists, and group booking management.
        </p>
      </div>

      <!-- Navigation View Switcher (Tape Chart vs Frontdesk Dashboard) -->
      <div class="flex items-center bg-gray-200/80 p-1 rounded-xl shrink-0 self-start md:self-auto shadow-inner">
        <button
          @click="activeView = 'tape_chart'"
          :class="[
            activeView === 'tape_chart'
              ? 'bg-white text-blue-600 font-bold shadow-xs'
              : 'text-gray-600 hover:text-gray-900 font-medium',
            'px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all'
          ]"
        >
          <PhCalendarBlank class="w-4 h-4" />
          <span>Tape Chart Matrix</span>
        </button>

        <button
          @click="activeView = 'dashboard'"
          :class="[
            activeView === 'dashboard'
              ? 'bg-white text-blue-600 font-bold shadow-xs'
              : 'text-gray-600 hover:text-gray-900 font-medium',
            'px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-all'
          ]"
        >
          <PhListChecks class="w-4 h-4" />
          <span>Frontdesk Dashboard</span>
        </button>
      </div>
    </div>

    <!-- Active View Component Render -->
    <TapeChart v-if="activeView === 'tape_chart'" />
    <FrontdeskDashboard v-if="activeView === 'dashboard'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TapeChart from '../components/frontdesk/TapeChart.vue'
import FrontdeskDashboard from '../components/frontdesk/FrontdeskDashboard.vue'
import { PhCalendarBlank, PhListChecks } from '@phosphor-icons/vue'

const activeView = ref('tape_chart')
</script>
