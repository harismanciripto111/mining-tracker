import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

import './styles/variables.css'
import './styles/main.css'
import './styles/glassmorphism.css'
import './styles/animations.css'
import './styles/responsive.css'

const app = createApp(App)

// Pinia with localStorage persistence
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Vue Router
app.use(router)

// ApexCharts
app.use(VueApexCharts)

// tsParticles
app.use(Particles, {
  init: async (engine: any) => {
    await loadSlim(engine)
  }
})

// Mount app
app.mount('#app')
