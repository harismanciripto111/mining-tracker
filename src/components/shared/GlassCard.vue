<script setup lang="ts">
withDefaults(defineProps<{
  hoverable?: boolean
  padding?: string
  noPadding?: boolean
}>(), {
  hoverable: true,
  padding: '1.5rem',
  noPadding: false
})
</script>

<template>
  <div
    class="glass-card"
    :class="{ 'glass-card--hoverable': hoverable }"
    :style="{ padding: noPadding ? '0' : padding }"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  background: var(--bg-card);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card--hoverable:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}
</style>