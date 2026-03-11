<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useExport } from '@/composables/useExport'

const router = useRouter()
const { exportJSON, exportCSV } = useExport()

const actions = [
  {
    label: 'Add Trade',
    icon: 'plus-circle',
    color: '#10b981',
    action: () => router.push('/pnl?action=add')
  },
  {
    label: 'Log Mining',
    icon: 'cpu',
    color: '#06b6d4',
    action: () => router.push('/mining?action=log')
  },
  {
    label: 'Export JSON',
    icon: 'download',
    color: '#8b5cf6',
    action: () => exportJSON()
  },
  {
    label: 'Export CSV',
    icon: 'file-text',
    color: '#f59e0b',
    action: () => exportCSV()
  }
]
</script>

<template>
  <div class="quick-actions">
    <h4 class="quick-actions__title">Quick Actions</h4>
    <div class="quick-actions__grid">
      <button
        v-for="item in actions"
        :key="item.label"
        class="quick-action-btn"
        @click="item.action"
      >
        <span class="quick-action-btn__icon" :style="{ color: item.color, backgroundColor: item.color + '15' }">
          <svg v-if="item.icon === 'plus-circle'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <svg v-else-if="item.icon === 'cpu'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
          </svg>
          <svg v-else-if="item.icon === 'download'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        </span>
        <span class="quick-action-btn__label">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.quick-actions__title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quick-actions__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-primary);
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.quick-action-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.quick-action-btn__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-action-btn__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
}
</style>