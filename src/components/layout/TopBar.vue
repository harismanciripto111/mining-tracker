<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProfitStore } from '@/stores/profit'
import { useMiningStore } from '@/stores/mining'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const profitStore = useProfitStore()
const miningStore = useMiningStore()
const settings = useSettingsStore()

const currentTime = ref(new Date())
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const pageTitle = computed(() => {
  return (route.meta.title as string) || 'Dashboard'
})

const formattedTime = computed(() => {
  return currentTime.value.toLocaleTimeString(settings.locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
})

const formattedDate = computed(() => {
  return currentTime.value.toLocaleDateString(settings.locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const totalPnL = computed(() => profitStore.totalProfit)
const activeRigs = computed(() => miningStore.activeRigs.length)
const totalRigs = computed(() => miningStore.totalRigs)
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <h1 class="topbar__title">{{ pageTitle }}</h1>
    </div>

    <div class="topbar__right">
      <!-- Quick Stats -->
      <div class="topbar__stats">
        <div class="topbar__stat">
          <span class="topbar__stat-label">P&L</span>
          <span
            class="topbar__stat-value font-mono"
            :class="totalPnL >= 0 ? 'text-profit' : 'text-loss'"
          >
            {{ settings.currencySymbol }}{{ Math.abs(totalPnL).toFixed(2) }}
          </span>
        </div>

        <div class="topbar__divider"></div>

        <div class="topbar__stat">
          <span class="topbar__stat-label">Rigs</span>
          <span class="topbar__stat-value">
            <span class="text-accent">{{ activeRigs }}</span>
            <span class="text-muted">/{{ totalRigs }}</span>
          </span>
        </div>
      </div>

      <div class="topbar__divider"></div>

      <!-- Clock -->
      <div class="topbar__clock">
        <span class="topbar__clock-time font-mono">{{ formattedTime }}</span>
        <span class="topbar__clock-date">{{ formattedDate }}</span>
      </div>

      <!-- Theme Toggle -->
      <button class="topbar__theme-toggle" @click="settings.toggleTheme" title="Toggle theme">
        <svg v-if="settings.theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--topbar-height);
  padding: 0 2rem;
  border-bottom: 1px solid var(--border-divider);
  background: rgba(10, 14, 23, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  top: 0;
  z-index: var(--z-topbar);
}

.topbar__title {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar__stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topbar__stat {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.topbar__stat-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  line-height: 1;
}

.topbar__stat-value {
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
}

.topbar__divider {
  width: 1px;
  height: 28px;
  background: var(--border-divider);
}

.topbar__clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.topbar__clock-time {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.topbar__clock-date {
  font-size: 10px;
  color: var(--text-muted);
  line-height: 1.2;
}

.topbar__theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-card);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.topbar__theme-toggle:hover {
  border-color: var(--border-card-hover);
  color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.topbar__theme-toggle svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 1023px) {
  .topbar {
    padding: 0 1.25rem;
  }

  .topbar__stats {
    display: none;
  }
}

@media (max-width: 767px) {
  .topbar__clock {
    display: none;
  }
}
</style>