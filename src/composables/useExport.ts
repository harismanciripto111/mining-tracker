import Papa from 'papaparse'
import { useProfitStore } from '@/stores/profit'
import { useMiningStore } from '@/stores/mining'
import { useSettingsStore } from '@/stores/settings'
import type { ExportData, Transaction } from '@/types'

export function useExport() {
  const profitStore = useProfitStore()
  const miningStore = useMiningStore()
  const settingsStore = useSettingsStore()

  // Download helper
  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // Export all data as JSON
  function exportJSON() {
    const data: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      transactions: profitStore.transactions,
      rigs: miningStore.rigs,
      miningLogs: miningStore.miningLogs,
      settings: {
        theme: settingsStore.theme,
        accentColor: settingsStore.accentColor,
        currency: settingsStore.currency,
        currencySymbol: settingsStore.currencySymbol,
        particlesEnabled: settingsStore.particlesEnabled,
        particleDensity: settingsStore.particleDensity,
        animationsEnabled: settingsStore.animationsEnabled,
        locale: settingsStore.locale
      }
    }
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `mining-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json')
  }

  // Import JSON backup
  function importJSON(file: File): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string) as ExportData
          if (!data.version || !data.transactions) {
            resolve({ success: false, message: 'Invalid backup file format' })
            return
          }
          profitStore.importTransactions(data.transactions)
          resolve({
            success: true,
            message: `Imported ${data.transactions.length} transactions`
          })
        } catch {
          resolve({ success: false, message: 'Failed to parse backup file' })
        }
      }
      reader.readAsText(file)
    })
  }

  // Export transactions as CSV
  function exportCSV(transactions?: Transaction[]) {
    const data = transactions || profitStore.transactions
    const csv = Papa.unparse(data.map(t => ({
      Date: t.date,
      Amount: t.amount,
      Type: t.type,
      Category: t.category,
      Description: t.description,
      'Created At': t.createdAt
    })))
    downloadFile(csv, `transactions-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv')
  }

  // Import CSV
  function importCSV(file: File): Promise<{ success: boolean; message: string; count: number }> {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            let count = 0
            for (const row of results.data as Record<string, string>[]) {
              if (row.Date && row.Amount) {
                profitStore.addTransaction({
                  date: row.Date,
                  amount: parseFloat(row.Amount),
                  type: (row.Type as any) || 'profit',
                  category: (row.Category as any) || 'other',
                  description: row.Description || ''
                })
                count++
              }
            }
            resolve({ success: true, message: `Imported ${count} transactions`, count })
          } catch {
            resolve({ success: false, message: 'Failed to parse CSV', count: 0 })
          }
        },
        error: () => {
          resolve({ success: false, message: 'Failed to read CSV file', count: 0 })
        }
      })
    })
  }

  return {
    exportJSON,
    importJSON,
    exportCSV,
    importCSV
  }
}
