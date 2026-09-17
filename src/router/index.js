import { createRouter, createWebHistory } from 'vue-router'
import FrontdeskView from '../views/FrontdeskView.vue'
import HousekeepingView from '../views/HousekeepingView.vue'
import CorporateView from '../views/CorporateView.vue'
import ForecastView from '../views/ForecastView.vue'
import CancelListView from '../views/CancelListView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
  {
    path: '/',
    name: 'Frontdesk',
    component: FrontdeskView,
  },
  {
    path: '/housekeeping',
    name: 'Housekeeping',
    component: HousekeepingView,
  },
  {
    path: '/corporate',
    name: 'Corporate',
    component: CorporateView,
  },
  {
    path: '/forecast',
    name: 'Forecast',
    component: ForecastView,
  },
  {
    path: '/cancel-list',
    name: 'CancelList',
    component: CancelListView,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
