<script setup lang="ts">
import { ref, computed } from 'vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns'
import { useProfitStore } from '@/stores/profit'
import { useSettingsStore } from '@/stores/settings'
import { formatCurrency } from '@/utils/formatters'
import { getIntensityColor } from '@/utils/colors'

const profitStore = useProfitStore()
const settings = useSettingsStore()

const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const monthLabel = computed(() => format(currentDate.value, 'MMMM yyyy'))

function prevMonth() {
  currentDate.value = subMonths(currentDate.value, 1)
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1)
}

function goToToday() {
  currentDate.value = new Date()
}

const calendarData = computed(() => {
  return profitStore.getMonthlyCalendarData(currentYear.value, currentMonth.value)
})

// Find max absolute amount for intensity scaling
const maxAmount = computed(() => {
  const amounts = calendarData.value.map(d => Math.abs(d.amount))
  return Math.max(...amounts, 1)
})

// Build calendar grid with padding for day-of-week alignment
const calendarGrid = computed(() => {
  const start = startOfMonth(currentDate.value)
  const startDow = getDay(start) // 0=Sun
  const padding = Array.from({ length: startDow }, () => null)
  return [...padding, ...calendarData.value]
})

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthlyTotal = computed(() => {
  return calendarData.value.reduce((sum, d) => sum + d.amount, 0)
})
</script>

<template>
  <div class="pnl-calendar">
    <!-- Header -->
    <div class="pnl-calendar__header">
      <div class="pnl-calendar__nav">
        <button class="pnl-calendar__nav-btn" @click="prevMonth">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h3 class="pnl-calendar__month">{{ monthLabel }}</h3>
        <button class="pnl-calendar__nav-btn" @click="nextMonth">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <button class="pnl-calendar__today-btn" @click="goToToday">Today</button>
      </div>
      <div class="pnl-calendar__total" :class="monthlyTotal >= 0 ? 'pnl-positive' : 'pnl-negative'">
        {{ formatCurrency(monthlyTotal, settings.currencySymbol) }}
      </div>
    </div>

    <!-- Weekday headers -->
    <div class="pnl-calendar__weekdays">
      <div v-for="day in weekdays" :key="day" class="pnl-calendar__weekday">{{ day }}</div>
    </div>

    <!-- Calendar grid -->
    <div class="pnl-calendar__grid">
      <div
        v-for="(day, index) in calendarGrid"
        :key="index"
        class="pnl-calendar__cell"
        :class="{
          'pnl-calendar__cell--empty': !day,
          'pnl-calendar__cell--positive': day && day.amount > 0,
          'pnl-calendar__cell--negative': day && day.amount < 0,
          'pnl-calendar__cell--neutral': day && day.amount === 0,
          'pnl-calendar__cell--today': day && day.date === format(new Date(), 'yyyy-MM-dd')
        }"
        :style="day && day.transactionCount > 0 ? { backgroundColor: getIntensityColor(day.amount, maxAmount) } : {}"
      >
        <template v-if="day">
          <span class="pnl-calendar__day">{{ parseInt(day.date.split('-')[2]) }}</span>
          <span v-if="day.transactionCount > 0" class="pnl-calendar__amount" :class="day.amount >= 0 ? 'pnl-positive' : 'pnl-negative'">
            {{ formatCurrency(day.amount, settings.currencySymbol) }}
          </span>
          <span v-if="day.transactionCount > 0" class="pnl-calendar__count">
            {{ day.transactionCount }} trade{{ day.transactionCount > 1 ? 's' : '' }}
          </span>
        </template>
      </div>
    </div>

    <!-- Legend -->
    <div class="pnl-calendar__legend">
      <div class="pnl-calendar__legend-item">
        <span class="pnl-calendar__legend-dot pnl-calendar__legend-dot--loss"></span>
        <span>Loss</span>
      </div>
      <div class="pnl-calendar__legend-item">
        <span class="pnl-calendar__legend-dot pnl-calendar__legend-dot--neutral"></span>
        <span>Neutral</span>
      </div>
      <div class="pnl-calendar__legend-item">
        <span class="pnl-calendar__legend-dot pnl-calendar__legend-dot--profit"></span>
        <span>Profit</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pnl-calendar {
  width: 100%;
}

.pnl-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.pnl-calendar__nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pnl-calendar__nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.pnl-calendar__nav-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--border-hover);
  color: var(--text-primary);
}

.pnl-calendar__month {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  min-width: 180px;
  text-align: center;
}

.pnl-calendar__today-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-primary);
  background: transparent;
  color: var(--accent-primary);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pnl-calendar__today-btn:hover {
  background: rgba(6, 182, 212, 0.1);
}

.pnl-calendar__total {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 600;
}

.pnl-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 4px;
}

.pnl-calendar__weekday {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0;
}

.pnl-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.pnl-calendar__cell {
  aspect-ratio: 1;
  border-radius: 8px;
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  min-height: 70px;
}

.pnl-calendar__cell--empty {
  background: transparent;
}

.pnl-calendar__cell--neutral {
  background: rgba(255, 255, 255, 0.02);
}

.pnl-calendar__cell--today {
  border-color: var(--accent-primary) !important;
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.2);
}

.pnl-calendar__cell:not(.pnl-calendar__cell--empty):hover {
  transform: scale(1.05);
  z-index: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.pnl-calendar__day {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.pnl-calendar__amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 600;
}

.pnl-calendar__count {
  font-size: 0.6rem;
  color: var(--text-muted);
}

.pnl-positive { color: var(--profit-green); }
.pnl-negative { color: var(--loss-red); }

.pnl-calendar__legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-primary);
}

.pnl-calendar__legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.pnl-calendar__legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.pnl-calendar__legend-dot--profit { background: rgba(16, 185, 129, 0.5); }
.pnl-calendar__legend-dot--loss { background: rgba(239, 68, 68, 0.5); }
.pnl-calendar__legend-dot--neutral { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); }

@media (max-width: 768px) {
  .pnl-calendar__cell {
    min-height: 50px;
    padding: 0.2rem;
  }
  .pnl-calendar__amount { font-size: 0.6rem; }
  .pnl-calendar__count { display: none; }
}
</style>
