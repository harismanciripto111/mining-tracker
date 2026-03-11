<script setup lang="ts">
import { computed } from 'vue'
import type { MiningRig } from '@/types'
import { useMiningStore } from '@/stores/mining'
import { useSettingsStore } from '@/stores/settings'
import { formatCurrency, formatHashrate, formatPower } from '@/utils/formatters'
import StatusBadge from '@/components/shared/StatusBadge.vue'

const props = defineProps<{
  rig: MiningRig
}>()

const emit = defineEmits<{
  edit: [rig: MiningRig]
  delete: [id: string]
  'toggle-status': [id: string]
}>()

const miningStore = useMiningStore()
const settings = useSettingsStore()

const profitSummary = computed(() => miningStore.getRigProfitSummary(props.rig.id))
const dailyPowerCost = computed(() => {
  return (props.rig.powerConsumption / 1000) * 24 * props.rig.electricityCost
})
</script>

<template>
  <div class="rig-card glass-card" :class="`rig-card--${rig.status}`">
    <div class="rig-card__header">
      <div class="rig-card__title-row">
        <h3 class="rig-card__name">{{ rig.name }}</h3>
        <StatusBadge :status="rig.status" size="sm" />
      </div>
      <div class="rig-card__actions">
        <button class="rig-card__btn" title="Edit" @click="emit('edit', rig)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="rig-card__btn rig-card__btn--danger" title="Delete" @click="emit('delete', rig.id)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>

    <div class="rig-card__specs">
      <div class="rig-card__spec">
        <span class="rig-card__spec-label">GPU</span>
        <span class="rig-card__spec-value">{{ rig.gpuCount }}x {{ rig.gpuModel }}</span>
      </div>
      <div class="rig-card__spec">
        <span class="rig-card__spec-label">Hashrate</span>
        <span class="rig-card__spec-value">{{ formatHashrate(rig.hashrate, rig.hashrateUnit) }}</span>
      </div>
      <div class="rig-card__spec">
        <span class="rig-card__spec-label">Power</span>
        <span class="rig-card__spec-value">{{ formatPower(rig.powerConsumption) }}</span>
      </div>
      <div class="rig-card__spec">
        <span class="rig-card__spec-label">Daily Cost</span>
        <span class="rig-card__spec-value">{{ formatCurrency(dailyPowerCost, settings.currencySymbol) }}</span>
      </div>
    </div>

    <div class="rig-card__footer">
      <div class="rig-card__pool">
        <span class="rig-card__pool-label">{{ rig.pool }}</span>
        <span class="rig-card__pool-coin">{{ rig.coin }}</span>
      </div>
      <div class="rig-card__profit">
        <span class="rig-card__profit-label">Net Profit</span>
        <span class="rig-card__profit-value" :class="profitSummary.totalNet >= 0 ? 'pnl-positive' : 'pnl-negative'">
          {{ formatCurrency(profitSummary.totalNet, settings.currencySymbol) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rig-card {
  padding: 1.25rem;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.rig-card--active { border-left-color: #10b981; }
.rig-card--idle { border-left-color: #f59e0b; }
.rig-card--maintenance { border-left-color: #8b5cf6; }
.rig-card--offline { border-left-color: #ef4444; }

.rig-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.rig-card__title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rig-card__name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.rig-card__actions {
  display: flex;
  gap: 0.25rem;
}

.rig-card__btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid var(--border-primary);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.rig-card__btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
}

.rig-card__btn--danger:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.rig-card__specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.rig-card__spec {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rig-card__spec-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rig-card__spec-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
}

.rig-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-primary);
}

.rig-card__pool {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rig-card__pool-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.rig-card__pool-coin {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(6, 182, 212, 0.1);
  color: var(--accent-primary);
  font-weight: 600;
}

.rig-card__profit {
  text-align: right;
}

.rig-card__profit-label {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.rig-card__profit-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
}

.pnl-positive { color: var(--profit-green); }
.pnl-negative { color: var(--loss-red); }
</style>