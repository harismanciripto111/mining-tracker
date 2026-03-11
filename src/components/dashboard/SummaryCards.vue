<script setup lang="ts">
import { computed } from 'vue'
import { useProfitStore } from '@/stores/profit'
import { useSettingsStore } from '@/stores/settings'
import GlassCard from '@/components/shared/GlassCard.vue'
import AnimatedCounter from '@/components/shared/AnimatedCounter.vue'

const profitStore = useProfitStore()
const settings = useSettingsStore()

const props = withDefaults(defineProps<{
  year: number
  month: number
}>(), {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
})

const stats = computed(() => profitStore.getMonthlyStats(props.year, props.month))

const cards = computed(() => [
  {
    label: 'Monthly P&L',
    value: stats.value.totalPnL,
    format: 'currency' as const,
    colorize: true,
    icon: 'trending',
    color: stats.value.totalPnL >= 0 ? '#10b981' : '#ef4444'
  },
  {
    label: 'Win Rate',
    value: stats.value.winRate,
    format: 'percent' as const,
    colorize: false,
    icon: 'target',
    color: '#06b6d4'
  },
  {
    label: 'Best Day',
    value: stats.value.bestDay?.amount ?? 0,
    format: 'currency' as const,
    colorize: true,
    icon: 'arrow-up',
    color: '#10b981'
  },
  {
    label: 'Worst Day',
    value: stats.value.worstDay?.amount ?? 0,
    format: 'currency' as const,
    colorize: true,
    icon: 'arrow-down',
    color: '#ef4444'
  }
])
</script>

<template>
  <div class="summary-cards">
    <GlassCard v-for="card in cards" :key="card.label" class="summary-card" :hoverable="true">
      <div class="summary-card__header">
        <span class="summary-card__icon" :style="{ color: card.color, backgroundColor: card.color + '15' }">
          <svg v-if="card.icon === 'trending'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
          <svg v-else-if="card.icon === 'target'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
          <svg v-else-if="card.icon === 'arrow-up'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </span>
        <span class="summary-card__label">{{ card.label }}</span>
      </div>
      <div class="summary-card__value">
        <AnimatedCounter
          :value="card.value"
          :format="card.format"
          :colorize="card.colorize"
          :currency-symbol="settings.currencySymbol"
          :decimals="card.format === 'percent' ? 1 : 2"
        />
      </div>
    </GlassCard>
  </div>
</template>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.summary-card__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.summary-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-card__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.summary-card__value {
  font-size: 1.5rem;
  font-weight: 700;
}

@media (max-width: 1024px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>