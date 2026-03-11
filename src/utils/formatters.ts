import numeral from 'numeral'
import { format, formatDistanceToNow, parseISO } from 'date-fns'

// ---- Currency Formatting ----
export function formatCurrency(value: number, symbol = '$', compact = false): string {
  if (compact && Math.abs(value) >= 1000000) {
    return `${symbol}${numeral(value).format('0.00a').toUpperCase()}`
  }
  if (compact && Math.abs(value) >= 10000) {
    return `${symbol}${numeral(value).format('0.0a').toUpperCase()}`
  }
  const formatted = numeral(Math.abs(value)).format('0,0.00')
  const sign = value < 0 ? '-' : value > 0 ? '+' : ''
  return `${sign}${symbol}${formatted}`
}

export function formatCurrencyNoSign(value: number, symbol = '$'): string {
  return `${symbol}${numeral(Math.abs(value)).format('0,0.00')}`
}

// ---- Number Formatting ----
export function formatNumber(value: number, decimals = 2): string {
  return numeral(value).format(decimals > 0 ? `0,0.${'0'.repeat(decimals)}` : '0,0')
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatHashrate(value: number, unit: string): string {
  return `${numeral(value).format('0,0.00')} ${unit}`
}

export function formatPower(watts: number): string {
  if (watts >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`
  }
  return `${watts} W`
}

// ---- Date Formatting ----
export function formatDate(dateStr: string, fmt = 'MMM dd, yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, 'MMM dd')
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, 'MMM dd, yyyy HH:mm')
}

export function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

// ---- PnL Helpers ----
export function getPnLClass(amount: number): string {
  if (amount > 0) return 'pnl-positive'
  if (amount < 0) return 'pnl-negative'
  return 'pnl-neutral'
}

export function getPnLColor(amount: number): string {
  if (amount > 0) return 'var(--profit-green)'
  if (amount < 0) return 'var(--loss-red)'
  return 'var(--text-muted)'
}

export function getPnLSign(amount: number): string {
  if (amount > 0) return '+'
  if (amount < 0) return '-'
  return ''
}
