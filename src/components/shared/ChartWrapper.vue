<script setup lang="ts">
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

const props = withDefaults(defineProps<{
  type: string
  options: ApexOptions
  series: any[]
  height?: string | number
  title?: string
  subtitle?: string
}>(), {
  height: 350,
  title: '',
  subtitle: ''
})

const chartHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height
})
</script>

<template>
  <div class="chart-wrapper">
    <div v-if="title" class="chart-wrapper__header">
      <h3 class="chart-wrapper__title">{{ title }}</h3>
      <p v-if="subtitle" class="chart-wrapper__subtitle">{{ subtitle }}</p>
    </div>
    <div class="chart-wrapper__body">
      <VueApexCharts
        :type="type"
        :options="options"
        :series="series"
        :height="chartHeight"
        width="100%"
      />
    </div>
    <div v-if="$slots.footer" class="chart-wrapper__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
}

.chart-wrapper__header {
  margin-bottom: 1rem;
}

.chart-wrapper__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.chart-wrapper__subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
}

.chart-wrapper__body {
  width: 100%;
  min-height: 200px;
}

.chart-wrapper__footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-primary);
}
</style>