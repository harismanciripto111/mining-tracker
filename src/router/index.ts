import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Dashboard', icon: 'dashboard' }
  },
  {
    path: '/mining',
    name: 'mining',
    component: () => import('@/views/MiningView.vue'),
    meta: { title: 'Mining Tracker', icon: 'mining' }
  },
  {
    path: '/pnl',
    name: 'pnl',
    component: () => import('@/views/ProfitLossView.vue'),
    meta: { title: 'Profit & Loss', icon: 'pnl' }
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('@/views/AnalyticsView.vue'),
    meta: { title: 'Analytics', icon: 'analytics' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Settings', icon: 'settings' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0, behavior: 'smooth' }
  }
})

// Update page title on navigation
router.afterEach((to) => {
  const title = to.meta.title as string
  document.title = title ? `${title} | Mining Tracker` : 'Mining Tracker'
})

export default router
