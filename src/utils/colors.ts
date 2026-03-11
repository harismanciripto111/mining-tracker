// ============================================
// Color Constants & Helpers
// ============================================

export const colors = {
  profit: '#10b981',
  profitLight: '#34d399',
  loss: '#ef4444',
  lossLight: '#f87171',
  neutral: '#6b7280',
  warning: '#f59e0b',
  accent: '#06b6d4',
  accentLight: '#22d3ee',
  violet: '#8b5cf6',
  violetLight: '#a78bfa',
  bgCard: 'rgba(17, 25, 40, 0.75)',
  bgDark: '#0a0e17',
  textPrimary: '#f9fafb',
  textSecondary: '#9ca3af',
  textMuted: '#4b5563',
  border: 'rgba(255, 255, 255, 0.08)',
  borderHover: 'rgba(6, 182, 212, 0.3)',
}

// Status colors
export const statusColors: Record<string, string> = {
  active: '#10b981',
  idle: '#f59e0b',
  maintenance: '#8b5cf6',
  offline: '#ef4444',
}

// Category colors
export const categoryColors: Record<string, string> = {
  mining: '#06b6d4',
  trading: '#8b5cf6',
  staking: '#10b981',
  airdrop: '#f59e0b',
  other: '#6b7280',
}

// Chart color palette
export const chartPalette = [
  '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#ec4899', '#14b8a6', '#f97316',
]

// Get PnL background color with opacity
export function getPnLBgColor(amount: number, opacity = 0.15): string {
  if (amount > 0) return `rgba(16, 185, 129, ${opacity})`
  if (amount < 0) return `rgba(239, 68, 68, ${opacity})`
  return 'transparent'
}

// Interpolate color intensity based on value
export function getIntensityColor(amount: number, maxAmount: number): string {
  const intensity = Math.min(Math.abs(amount) / Math.max(maxAmount, 1), 1)
  const alpha = 0.1 + intensity * 0.6
  if (amount > 0) return `rgba(16, 185, 129, ${alpha})`
  if (amount < 0) return `rgba(239, 68, 68, ${alpha})`
  return 'transparent'
}
