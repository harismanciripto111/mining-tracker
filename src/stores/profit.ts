import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isWithinInterval } from 'date-fns'
import type { Transaction, TransactionFormData, TransactionFilter, DailyPnL, MonthlyStats } from '@/types'
import { getSeedTransactions } from '@/utils/seedData'

export const useProfitStore = defineStore('profit', () => {
  // ---- State ----
  const transactions = ref<Transaction[]>([])
  const seedLoaded = ref(false)

  // ---- Getters ----
  const sortedTransactions = computed(() => {
    return [...transactions.value].sort((a, b) => b.date.localeCompare(a.date))
  })

  const totalProfit = computed(() => {
    return transactions.value.reduce((sum, t) => sum + t.amount, 0)
  })

  const totalTransactions = computed(() => transactions.value.length)

  const profitableTransactions = computed(() => {
    return transactions.value.filter(t => t.amount > 0)
  })

  const losingTransactions = computed(() => {
    return transactions.value.filter(t => t.amount < 0)
  })

  // Daily P&L map
  const dailyPnLMap = computed(() => {
    const map = new Map<string, DailyPnL>()
    transactions.value.forEach(t => {
      const existing = map.get(t.date)
      if (existing) {
        existing.amount += t.amount
        existing.transactionCount++
      } else {
        map.set(t.date, {
          date: t.date,
          amount: t.amount,
          transactionCount: 1
        })
      }
    })
    return map
  })

  // Get daily P&L for a specific month
  function getMonthlyCalendarData(year: number, month: number): DailyPnL[] {
    const start = startOfMonth(new Date(year, month - 1))
    const end = endOfMonth(start)
    const days = eachDayOfInterval({ start, end })

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const existing = dailyPnLMap.value.get(dateStr)
      return existing || { date: dateStr, amount: 0, transactionCount: 0 }
    })
  }

  // Monthly stats for a specific month
  function getMonthlyStats(year: number, month: number): MonthlyStats {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`
    const calendarData = getMonthlyCalendarData(year, month)
    const daysWithData = calendarData.filter(d => d.transactionCount > 0)

    const totalPnL = calendarData.reduce((sum, d) => sum + d.amount, 0)
    const profitDays = daysWithData.filter(d => d.amount > 0).length
    const lossDays = daysWithData.filter(d => d.amount < 0).length
    const neutralDays = daysWithData.filter(d => d.amount === 0 && d.transactionCount > 0).length

    const sortedByAmount = [...daysWithData].sort((a, b) => b.amount - a.amount)
    const bestDay = sortedByAmount.length > 0 ? sortedByAmount[0] : null
    const worstDay = sortedByAmount.length > 0 ? sortedByAmount[sortedByAmount.length - 1] : null

    const totalDaysTraded = profitDays + lossDays + neutralDays
    const winRate = totalDaysTraded > 0 ? (profitDays / totalDaysTraded) * 100 : 0

    // ROI calculation: assume starting capital from settings or estimate
    const roi = totalPnL !== 0 ? (totalPnL / Math.max(Math.abs(totalPnL) * 10, 1)) * 100 : 0

    return {
      month: monthStr,
      totalPnL,
      roi,
      profitDays,
      lossDays,
      neutralDays,
      bestDay,
      worstDay,
      winRate
    }
  }

  // Filter transactions
  function filterTransactions(filter: TransactionFilter): Transaction[] {
    return sortedTransactions.value.filter(t => {
      // Date range
      if (filter.dateFrom && filter.dateTo) {
        const date = parseISO(t.date)
        const from = parseISO(filter.dateFrom)
        const to = parseISO(filter.dateTo)
        if (!isWithinInterval(date, { start: from, end: to })) return false
      } else if (filter.dateFrom) {
        if (t.date < filter.dateFrom) return false
      } else if (filter.dateTo) {
        if (t.date > filter.dateTo) return false
      }

      // Categories
      if (filter.categories.length > 0 && !filter.categories.includes(t.category)) return false

      // Types
      if (filter.types.length > 0 && !filter.types.includes(t.type)) return false

      // Amount range
      if (filter.amountMin !== null && t.amount < filter.amountMin) return false
      if (filter.amountMax !== null && t.amount > filter.amountMax) return false

      // Search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase()
        const matchDesc = t.description.toLowerCase().includes(query)
        const matchCat = t.category.toLowerCase().includes(query)
        if (!matchDesc && !matchCat) return false
      }

      return true
    })
  }

  // Cumulative profit over time
  const cumulativeProfitData = computed(() => {
    const sorted = [...transactions.value].sort((a, b) => a.date.localeCompare(b.date))
    let cumulative = 0
    return sorted.map(t => {
      cumulative += t.amount
      return { x: t.date, y: parseFloat(cumulative.toFixed(2)) }
    })
  })

  // ---- Actions ----
  function addTransaction(data: TransactionFormData) {
    const now = new Date().toISOString()
    const transaction: Transaction = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    }
    transactions.value.push(transaction)
  }

  function updateTransaction(id: string, data: Partial<TransactionFormData>) {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  function deleteAllTransactions() {
    transactions.value = []
  }

  function importTransactions(imported: Transaction[]) {
    // Merge: skip duplicates by ID
    const existingIds = new Set(transactions.value.map(t => t.id))
    const newItems = imported.filter(t => !existingIds.has(t.id))
    transactions.value.push(...newItems)
  }

  function loadSeedDataIfEmpty() {
    if (!seedLoaded.value && transactions.value.length === 0) {
      transactions.value = getSeedTransactions()
      seedLoaded.value = true
    }
  }

  return {
    // State
    transactions,
    seedLoaded,
    // Getters
    sortedTransactions,
    totalProfit,
    totalTransactions,
    profitableTransactions,
    losingTransactions,
    dailyPnLMap,
    cumulativeProfitData,
    // Methods
    getMonthlyCalendarData,
    getMonthlyStats,
    filterTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    importTransactions,
    loadSeedDataIfEmpty
  }
}, {
  persist: true
})
