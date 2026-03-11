<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfitStore } from '@/stores/profit'
import { useMiningStore } from '@/stores/mining'
import { useSettingsStore } from '@/stores/settings'
import { formatCurrency, formatNumber } from '@/utils/formatters'
import GlassCard from '@/components/shared/GlassCard.vue'
import AnimatedCounter from '@/components/shared/AnimatedCounter.vue'
import PnLCalendar from '@/components/dashboard/PnLCalendar.vue'
import SummaryCards from '@/components/dashboard/SummaryCards.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'

const profitStore = useProfitStore()
const miningStore = useMiningStore()
const settings = useSettingsStore()

onMounted(() => {
  profitStore.loadSeedDataIfEmpty()
})
</script>

<template>
  <div class="dashboard-view">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Overview of your mining & trading performance</p>
    </div>

    <!-- Summary Cards -->
    <SummaryCards :year="new Date().getFullYear()" :month="new Date().getMonth() + 1" />

    <!-- Main Content Grid -->
    <div class="dashboard-grid">
      <!-- P&L Calendar (main area) -->
      <GlassCard class="dashboard-grid__calendar" :hoverable="false">
        <PnLCalendar />
      </GlassCard>

      <!-- Sidebar widgets -->
      <div class="dashboard-grid__sidebar">
        <!-- Quick Actions -->
        <GlassCard :hoverable="false">
          <QuickActions />
        </GlassCard>

        <!-- Portfolio Overview -->
        <GlassCard :hoverable="false">
          <h4 class="widget-title">Portfolio Overview</h4>
          <div class="portfolio-stats">
            <div class="portfolio-stat">
              <span class="portfolio-stat__label">Total Profit</span>
              <AnimatedCounter
                :value="profitStore.totalProfit"
                format="currency"
                :colorize="true"
                :currency-symbol="settings.currencySymbol"
                class="portfolio-stat__value"
              />
            </div>
            <div class="portfolio-stat">
              <span class="portfolio-stat__label">Total Trades</span>
              <span class="portfolio-stat__value portfolio-stat__value--accent">
                {{ formatNumber(profitStore.totalTransactions, 0) }}
              </span>
            </div>
            <div class="portfolio-stat">
              <span class="portfolio-stat__label">Mining Rigs</span>
              <span class="portfolio-stat__value portfolio-stat__value--accent">
                {{ miningStore.activeRigs.length }} / {{ miningStore.totalRigs }}
              </span>
            </div>
            <div class="portfolio-stat">
              <span class="portfolio-stat__label">Mining Profit</span>
              <AnimatedCounter
                :value="miningStore.totalMiningProfit"
                format="currency"
                :colorize="true"
                :currency-symbol="settings.currencySymbol"
                class="portfolio-stat__value"
              />
            </div>
          </div>
        </GlassCard>

        <!-- Recent Activity -->
        <GlassCard :hoverable="false">
          <h4 class="widget-title">Recent Transactions</h4>
          <div class="recent-list">
            <div
              v-for="tx in profitStore.sortedTransactions.slice(0, 5)"
              :key="tx.id"
              class="recent-item"
            >
              <div class="recent-item__info">
                <span class="recent-item__desc">{{ tx.description || tx.category }}</span>
                <span class="recent-item__date">{{ tx.date }}</span>
              </div>
              <span
                class="recent-item__amount"
                :class="tx.amount >= 0 ? 'pnl-positive' : 'pnl-negative'"
              >
                {{ formatCurrency(tx.amount, settings.currencySymbol) }}
              </span>
            </div>
            <div v-if="profitStore.sortedTransactions.length === 0" class="recent-empty">
              No transactions yet
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 0;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.25rem;
  margin-top: 1.25rem;
}

.dashboard-grid__sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.widget-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.portfolio-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.portfolio-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-primary);
}

.portfolio-stat:last-child {
  border-bottom: none;
}

.portfolio-stat__label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.portfolio-stat__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.portfolio-stat__value--accent {
  color: var(--accent-primary);
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.2s ease;
}

.recent-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.recent-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.recent-item__desc {
  font-size: 0.8rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-item__date {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.recent-item__amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.pnl-positive { color: var(--profit-green); }
.pnl-negative { color: var(--loss-red); }

.recent-empty {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>