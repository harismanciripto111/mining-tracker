import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { MiningRig, MiningLog, RigFormData, MiningLogFormData, RigStatus } from '@/types'

export const useMiningStore = defineStore('mining', () => {
  // ---- State ----
  const rigs = ref<MiningRig[]>([])
  const miningLogs = ref<MiningLog[]>([])

  // ---- Getters ----
  const activeRigs = computed(() => rigs.value.filter(r => r.status === 'active'))
  const totalRigs = computed(() => rigs.value.length)

  const totalHashrate = computed(() => {
    // Normalize all to MH/s for comparison
    return activeRigs.value.reduce((sum, rig) => {
      return sum + normalizeHashrate(rig.hashrate, rig.hashrateUnit)
    }, 0)
  })

  const totalPowerConsumption = computed(() => {
    return activeRigs.value.reduce((sum, rig) => sum + rig.powerConsumption, 0)
  })

  const totalDailyPowerCost = computed(() => {
    return activeRigs.value.reduce((sum, rig) => {
      return sum + (rig.powerConsumption / 1000) * 24 * rig.electricityCost
    }, 0)
  })

  const totalMiningProfit = computed(() => {
    return miningLogs.value.reduce((sum, log) => sum + log.netProfit, 0)
  })

  const sortedLogs = computed(() => {
    return [...miningLogs.value].sort((a, b) => b.date.localeCompare(a.date))
  })

  // Get logs for a specific rig
  function getRigLogs(rigId: string): MiningLog[] {
    return sortedLogs.value.filter(l => l.rigId === rigId)
  }

  // Get rig by ID
  function getRigById(id: string): MiningRig | undefined {
    return rigs.value.find(r => r.id === id)
  }

  // Get rig profit summary
  function getRigProfitSummary(rigId: string) {
    const logs = getRigLogs(rigId)
    const totalRevenue = logs.reduce((sum, l) => sum + l.usdValue, 0)
    const totalFees = logs.reduce((sum, l) => sum + l.poolFee, 0)
    const totalPower = logs.reduce((sum, l) => sum + l.powerCost, 0)
    const totalNet = logs.reduce((sum, l) => sum + l.netProfit, 0)
    const avgDaily = logs.length > 0 ? totalNet / logs.length : 0

    return {
      totalRevenue,
      totalFees,
      totalPower,
      totalNet,
      avgDaily,
      logCount: logs.length
    }
  }

  // Status counts
  const statusCounts = computed(() => {
    const counts: Record<RigStatus, number> = {
      active: 0, idle: 0, maintenance: 0, offline: 0
    }
    rigs.value.forEach(r => counts[r.status]++)
    return counts
  })

  // ---- Actions ----
  function addRig(data: RigFormData) {
    const now = new Date().toISOString()
    const rig: MiningRig = {
      id: uuidv4(),
      ...data,
      createdAt: now,
      updatedAt: now
    }
    rigs.value.push(rig)
    return rig
  }

  function updateRig(id: string, data: Partial<RigFormData>) {
    const index = rigs.value.findIndex(r => r.id === id)
    if (index !== -1) {
      rigs.value[index] = {
        ...rigs.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function deleteRig(id: string) {
    rigs.value = rigs.value.filter(r => r.id !== id)
    // Also remove associated logs
    miningLogs.value = miningLogs.value.filter(l => l.rigId !== id)
  }

  function updateRigStatus(id: string, status: RigStatus) {
    const rig = rigs.value.find(r => r.id === id)
    if (rig) {
      rig.status = status
      rig.updatedAt = new Date().toISOString()
    }
  }

  function addMiningLog(data: MiningLogFormData) {
    const netProfit = data.usdValue - data.poolFee - data.powerCost
    const log: MiningLog = {
      id: uuidv4(),
      ...data,
      netProfit,
      createdAt: new Date().toISOString()
    }
    miningLogs.value.push(log)
    return log
  }

  function deleteMiningLog(id: string) {
    miningLogs.value = miningLogs.value.filter(l => l.id !== id)
  }

  function deleteAllData() {
    rigs.value = []
    miningLogs.value = []
  }

  // ---- Helpers ----
  function normalizeHashrate(value: number, unit: string): number {
    const multipliers: Record<string, number> = {
      'H/s': 0.000001,
      'KH/s': 0.001,
      'MH/s': 1,
      'GH/s': 1000,
      'TH/s': 1000000
    }
    return value * (multipliers[unit] || 1)
  }

  return {
    // State
    rigs,
    miningLogs,
    // Getters
    activeRigs,
    totalRigs,
    totalHashrate,
    totalPowerConsumption,
    totalDailyPowerCost,
    totalMiningProfit,
    sortedLogs,
    statusCounts,
    // Methods
    getRigLogs,
    getRigById,
    getRigProfitSummary,
    addRig,
    updateRig,
    deleteRig,
    updateRigStatus,
    addMiningLog,
    deleteMiningLog,
    deleteAllData
  }
}, {
  persist: true
})
