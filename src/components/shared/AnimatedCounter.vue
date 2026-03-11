<script setup lang="ts">
import { useAnimatedCounter } from '@/composables/useAnimatedCounter'
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  format?: 'currency' | 'number' | 'percent'
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  currencySymbol?: string
  colorize?: boolean
}>(), {
  format: 'currency',
  prefix: '',
  suffix: '',
  decimals: 2,
  duration: 800,
  currencySymbol: '$',
  colorize: false
})

const { displayValue } = useAnimatedCounter(
  () => props.value,
  props.duration,
  props.decimals
)

const formattedValue = computed(() => {
  switch (props.format) {
    case 'currency':
      return formatCurrency(displayValue.value, props.currencySymbol)
    case 'percent':
      return formatPercent(displayValue.value, props.decimals)
    case 'number':
      return formatNumber(displayValue.value, props.decimals)
    default:
      return displayValue.value.toString()
  }
})

const colorClass = computed(() => {
  if (!props.colorize) return ''
  if (displayValue.value > 0) return 'counter--positive'
  if (displayValue.value < 0) return 'counter--negative'
  return 'counter--neutral'
})
</script>

<template>
  <span class="animated-counter" :class="colorClass">
    {{ prefix }}{{ formattedValue }}{{ suffix }}
  </span>
</template>

<style scoped>
.animated-counter {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
  transition: color 0.3s ease;
}

.counter--positive {
  color: var(--profit-green);
}

.counter--negative {
  color: var(--loss-red);
}

.counter--neutral {
  color: var(--text-muted);
}
</style>