<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  message?: string
  actionLabel?: string
}>(), {
  icon: 'inbox',
  title: 'No data yet',
  message: 'Get started by adding your first entry.',
  actionLabel: ''
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <!-- Inbox icon -->
      <svg v-if="icon === 'inbox'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
      </svg>
      <!-- Chart icon -->
      <svg v-else-if="icon === 'chart'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      <!-- Mining icon -->
      <svg v-else-if="icon === 'mining'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      </svg>
      <!-- Default circle -->
      <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__message">{{ message }}</p>
    <button v-if="actionLabel" class="empty-state__action" @click="emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-state__icon {
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  opacity: 0.5;
}

.empty-state__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.5rem;
}

.empty-state__message {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0 0 1.5rem;
  max-width: 300px;
  line-height: 1.5;
}

.empty-state__action {
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  background: var(--accent-primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.empty-state__action:hover {
  background: var(--accent-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}
</style>