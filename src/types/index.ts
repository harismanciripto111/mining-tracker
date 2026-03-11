// ============================================
// Mining & Profit Tracker - Type Definitions
// ============================================

// ---- Transaction (P&L Entry) ----
export type TransactionType = 'profit' | 'loss' | 'fee' | 'reward'
export type TransactionCategory = 'mining' | 'trading' | 'staking' | 'airdrop' | 'other'

export interface Transaction {
  id: string
  date: string              // ISO date string (YYYY-MM-DD)
  amount: number            // USD value (positive = profit, negative = loss)
  type: TransactionType
  category: TransactionCategory
  description: string
  rigId?: string            // Link to mining rig (if mining category)
  createdAt: string         // ISO timestamp
  updatedAt: string         // ISO timestamp
}

// ---- Mining Rig ----
export type HashrateUnit = 'H/s' | 'KH/s' | 'MH/s' | 'GH/s' | 'TH/s'
export type RigStatus = 'active' | 'idle' | 'maintenance' | 'offline'

export interface MiningRig {
  id: string
  name: string              // e.g. "Rig #1 - RTX 4090"
  gpuModel: string
  gpuCount: number
  hashrate: number
  hashrateUnit: HashrateUnit
  powerConsumption: number  // Watts
  electricityCost: number   // $/kWh
  pool: string
  coin: string              // Mining coin (ETH, BTC, KAS, etc.)
  walletAddress: string
  status: RigStatus
  createdAt: string
  updatedAt: string
}

// ---- Mining Log (Daily Entry) ----
export interface MiningLog {
  id: string
  rigId: string
  date: string              // ISO date (YYYY-MM-DD)
  coinsMined: number
  usdValue: number
  poolFee: number           // USD
  powerCost: number         // USD
  netProfit: number         // usdValue - poolFee - powerCost
  avgHashrate: number
  notes: string
  createdAt: string
}

// ---- App Settings ----
export type ThemeMode = 'dark' | 'light'

export interface AppSettings {
  theme: ThemeMode
  accentColor: string       // Hex color
  currency: string          // USD, EUR, IDR, etc.
  currencySymbol: string    // $, EUR, Rp, etc.
  particlesEnabled: boolean
  particleDensity: number   // 1-100
  animationsEnabled: boolean
  locale: string            // en-US, id-ID, etc.
}

// ---- Dashboard Computed Types ----
export interface DailyPnL {
  date: string              // YYYY-MM-DD
  amount: number
  transactionCount: number
}

export interface MonthlyStats {
  month: string             // YYYY-MM
  totalPnL: number
  roi: number               // percentage
  profitDays: number
  lossDays: number
  neutralDays: number
  bestDay: DailyPnL | null
  worstDay: DailyPnL | null
  winRate: number           // percentage
}

// ---- Chart Data Types ----
export interface ChartDataPoint {
  x: string | number | Date
  y: number
}

export interface ChartSeries {
  name: string
  data: ChartDataPoint[] | number[]
}

// ---- Navigation ----
export interface NavItem {
  path: string
  label: string
  icon: string              // SVG icon name
  badge?: number | string
}

// ---- Form Types ----
export interface TransactionFormData {
  date: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  description: string
  rigId?: string
}

export interface RigFormData {
  name: string
  gpuModel: string
  gpuCount: number
  hashrate: number
  hashrateUnit: HashrateUnit
  powerConsumption: number
  electricityCost: number
  pool: string
  coin: string
  walletAddress: string
  status: RigStatus
}

export interface MiningLogFormData {
  rigId: string
  date: string
  coinsMined: number
  usdValue: number
  poolFee: number
  powerCost: number
  avgHashrate: number
  notes: string
}

// ---- Filter Types ----
export interface TransactionFilter {
  dateFrom: string | null
  dateTo: string | null
  categories: TransactionCategory[]
  types: TransactionType[]
  amountMin: number | null
  amountMax: number | null
  searchQuery: string
}

// ---- Export Types ----
export interface ExportData {
  version: string
  exportedAt: string
  transactions: Transaction[]
  rigs: MiningRig[]
  miningLogs: MiningLog[]
  settings: AppSettings
}
