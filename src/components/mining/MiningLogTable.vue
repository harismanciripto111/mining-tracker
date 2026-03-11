<script setup lang="ts">
import { computed } from 'vue'
import { useMiningStore } from '@/stores/mining'
import { useSettingsStore } from '@/stores/settings'
import { formatCurrency, formatDate, formatNumber } from '@/utils/formatters'
import type { MiningLog } from '@/types'

const props = defineProps<{
  rigId?: string
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const miningStore = useMiningStore()
const settings = useSettingsStore()

const logs = computed(() => {
  if (props.rigId) {
    return miningStore.getRigLogs(props.rigId)
  }
  return miningStore.sortedLogs
})

function getRigName(rigId: string): string {
  const rig = miningStore.getRigById(rigId)
  return rig ? rig.name : 'Unknown Rig'
}
</script>

<template>
  <div class="mining-log-table">
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-if="!rigId">Rig</th>
            <th>Date</th>
            <th>Coins Mined</th>
            <th>USD Value</th>
            <th>Pool Fee</th>
            <th>Power Cost</th>
            <th>Net Profit</th>
            <th>Hashrate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td v-if="!rigId" class="td-rig">{{ getRigName(log.rigId) }}</td>
            <td class="td-date">{{ formatDate(log.date) }}</td>
            <td class="td-mono">{{ formatNumber(log.coinsMined, 6) }}</td>
            <td class="td-mono">{{ formatCurrency(log.usdValue, settings.currencySymbol) }}</td>
            <td class="td-mono td-muted">-{{ formatCurrency(log.poolFee, settings.currencySymbol) }}</td>
            <td class="td-mono td-muted">-{{ formatCurrency(log.powerCost, settings.currencySymbol) }}</td>
            <td class="td-mono" :class="log.netProfit >= 0 ? 'td-profit' : 'td-loss'">
              {{ formatCurrency(log.netProfit, settings.currencySymbol) }}
            </td>
            <td class="td-mono">{{ formatNumber(log.avgHashrate, 1) }}</td>
            <td>
              <button class="table-btn table-btn--danger" @click="emit('delete', log.id)" title="Delete">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="logs.length === 0">
            <td :colspan="rigId ? 8 : 9" class="td-empty">No mining logs yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.data-table th {
  text-align: left;
  padding: 0.6rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border-primary);
  white-space: nowrap;
}

.data-table td {
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  white-space: nowrap;
}

.data-table tbody tr {
  transition: background 0.15s ease;
}

.data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

.td-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}

.td-date { color: var(--text-primary); }
.td-rig { color: var(--text-primary); font-weight: 500; }
.td-muted { color: var(--text-muted); }
.td-profit { color: var(--profit-green); font-weight: 500; }
.td-loss { color: var(--loss-red); font-weight: 500; }
.td-empty {
  text-align: center;
  padding: 2rem !important;
  color: var(--text-muted);
}

.table-btn {
  width: 26px;
  height: 26px;
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

.table-btn--danger:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
</style>