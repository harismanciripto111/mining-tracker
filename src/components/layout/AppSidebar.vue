<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { useProfitStore } from '@/stores/profit'

const route = useRoute()
const router = useRouter()
const settings = useSettingsStore()
const profitStore = useProfitStore()

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/mining', label: 'Mining', icon: 'mining' },
  { path: '/pnl', label: 'Profit & Loss', icon: 'pnl' },
  { path: '/analytics', label: 'Analytics', icon: 'analytics' },
  { path: '/settings', label: 'Settings', icon: 'settings' }
]

const isCollapsed = computed(() => settings.sidebarCollapsed)

const totalPnL = computed(() => profitStore.totalProfit)

function navigate(path: string) {
  router.push(path)
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar glass-sidebar" :class="{ 'sidebar--collapsed': isCollapsed }">
    <!-- Logo -->
    <div class="sidebar__logo" @click="navigate('/')">
      <div class="sidebar__logo-icon">
        <svg viewBox="0 0 32 32" fill="none">
          <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logo-gradient)" />
          <path d="M10 22V14l6-4 6 4v8l-6 4-6-4z" stroke="#0a0e17" stroke-width="1.5" fill="rgba(10,14,23,0.3)" />
          <path d="M16 10v12M10 14l6 4 6-4" stroke="#0a0e17" stroke-width="1.5" />
          <defs>
            <linearGradient id="logo-gradient" x1="2" y1="2" x2="30" y2="30">
              <stop stop-color="#06b6d4" />
              <stop offset="1" stop-color="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <transition name="fade">
        <span v-if="!isCollapsed" class="sidebar__logo-text">Mining Tracker</span>
      </transition>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="sidebar__nav-item"
        :class="{ 'sidebar__nav-item--active': isActive(item.path) }"
        @click="navigate(item.path)"
        :title="isCollapsed ? item.label : undefined"
      >
        <div class="sidebar__nav-icon">
          <!-- Dashboard -->
          <svg v-if="item.icon === 'dashboard'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <!-- Mining -->
          <svg v-else-if="item.icon === 'mining'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <!-- P&L -->
          <svg v-else-if="item.icon === 'pnl'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
          </svg>
          <!-- Analytics -->
          <svg v-else-if="item.icon === 'analytics'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3v18h18" />
            <path d="M7 16l4-4 4 4 5-6" />
          </svg>
          <!-- Settings -->
          <svg v-else-if="item.icon === 'settings'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="sidebar__nav-label">{{ item.label }}</span>
        </transition>
        <div v-if="isActive(item.path)" class="sidebar__nav-indicator"></div>
      </button>
    </nav>

    <!-- Bottom: P&L Summary -->
    <div class="sidebar__bottom">
      <div class="sidebar__pnl" :class="totalPnL >= 0 ? 'text-profit' : 'text-loss'">
        <span class="sidebar__pnl-label" v-if="!isCollapsed">Total P&L</span>
        <span class="sidebar__pnl-value font-mono">
          {{ totalPnL >= 0 ? '+' : '' }}{{ totalPnL.toFixed(2) }}
        </span>
      </div>

      <!-- Collapse Toggle -->
      <button class="sidebar__toggle" @click="settings.toggleSidebar" title="Toggle sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path v-if="!isCollapsed" d="M15 18l-6-6 6-6" />
          <path v-else d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  z-index: var(--z-sidebar);
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0.75rem;
  transition: width var(--transition-normal);
  overflow: hidden;
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed);
}

/* Logo */
.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 2rem;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.sidebar__logo:hover {
  background: rgba(255, 255, 255, 0.04);
}

.sidebar__logo-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.sidebar__logo-icon svg {
  width: 100%;
  height: 100%;
}

.sidebar__logo-text {
  font-size: var(--text-lg);
  font-weight: 700;
  background: linear-gradient(135deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

/* Navigation */
.sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  white-space: nowrap;
  text-align: left;
  width: 100%;
}

.sidebar__nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.sidebar__nav-item--active {
  background: rgba(var(--accent-primary-rgb), 0.1);
  color: var(--accent-primary);
}

.sidebar__nav-item--active:hover {
  background: rgba(var(--accent-primary-rgb), 0.15);
}

.sidebar__nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar__nav-icon svg {
  width: 100%;
  height: 100%;
}

.sidebar__nav-label {
  white-space: nowrap;
}

.sidebar__nav-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--accent-primary);
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px rgba(var(--accent-primary-rgb), 0.5);
}

/* Bottom section */
.sidebar__bottom {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--border-divider);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar__pnl {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
}

.sidebar__pnl-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.sidebar__pnl-value {
  font-size: var(--text-lg);
  font-weight: 600;
}

.sidebar__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.sidebar__toggle:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
}

.sidebar__toggle svg {
  width: 18px;
  height: 18px;
}

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .sidebar {
    display: none;
  }
}
</style>