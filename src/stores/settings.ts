import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  // ---- State ----
  const theme = ref<ThemeMode>('dark')
  const accentColor = ref('#06b6d4')
  const currency = ref('USD')
  const currencySymbol = ref('$')
  const particlesEnabled = ref(true)
  const particleDensity = ref(50)
  const animationsEnabled = ref(true)
  const locale = ref('en-US')
  const sidebarCollapsed = ref(false)

  // Currency map
  const currencyMap: Record<string, string> = {
    'USD': '$',
    'EUR': '\u20AC',
    'GBP': '\u00A3',
    'IDR': 'Rp',
    'JPY': '\u00A5',
    'KRW': '\u20A9',
    'CNY': '\u00A5',
    'BTC': '\u20BF',
    'ETH': '\u039E'
  }

  // ---- Actions ----
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme()
  }

  function setTheme(mode: ThemeMode) {
    theme.value = mode
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  function setAccentColor(color: string) {
    accentColor.value = color
    document.documentElement.style.setProperty('--accent-primary', color)
  }

  function setCurrency(code: string) {
    currency.value = code
    currencySymbol.value = currencyMap[code] || code
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function toggleParticles() {
    particlesEnabled.value = !particlesEnabled.value
  }

  function setParticleDensity(density: number) {
    particleDensity.value = Math.max(1, Math.min(100, density))
  }

  function toggleAnimations() {
    animationsEnabled.value = !animationsEnabled.value
  }

  function resetToDefaults() {
    theme.value = 'dark'
    accentColor.value = '#06b6d4'
    currency.value = 'USD'
    currencySymbol.value = '$'
    particlesEnabled.value = true
    particleDensity.value = 50
    animationsEnabled.value = true
    locale.value = 'en-US'
    sidebarCollapsed.value = false
    applyTheme()
  }

  // Watch theme changes
  watch(theme, () => applyTheme())

  return {
    // State
    theme,
    accentColor,
    currency,
    currencySymbol,
    particlesEnabled,
    particleDensity,
    animationsEnabled,
    locale,
    sidebarCollapsed,
    // Actions
    toggleTheme,
    setTheme,
    applyTheme,
    setAccentColor,
    setCurrency,
    toggleSidebar,
    toggleParticles,
    setParticleDensity,
    toggleAnimations,
    resetToDefaults
  }
}, {
  persist: true
})
