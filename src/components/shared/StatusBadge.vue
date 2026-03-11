<script setup lang="ts">
import { computed } from 'vue'
import { statusColors } from '@/utils/colors'

const props = withDefaults(defineProps<{
  status: string
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}>(), {
  size: 'md',
  pulse: false
})

const color = computed(() => statusColors[props.status] || '#6b7280')
const label = computed(() => props.status.charAt(0).toUpperCase() + props.status.slice(1))
</script>

<template>
  <span class="status-badge" :class="[`status-badge--${size}`, `status-badge--${status}`]">
    <span class="status-badge__dot" :class="{ 'status-badge__dot--pulse': pulse || status === 'active' }" :style="{ backgroundColor: color }" />
    <span class="status-badge__label">{{ label }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.status-badge--sm {
  padding: 2px 8px;
  font-size: 11px;
  gap: 4px;
}

.status-badge--lg {
  padding: 6px 14px;
  font-size: 14px;
  gap: 8px;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge--sm .status-badge__dot {
  width: 6px;
  height: 6px;
}

.status-badge__dot--pulse {
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }
  50% { opacity: 0.7; box-shadow: 0 0 8px 2px currentColor; }
}

.status-badge--active {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.status-badge--idle {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.status-badge--maintenance {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.status-badge--offline {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}
</style>