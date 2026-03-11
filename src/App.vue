<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useProfitStore } from '@/stores/profit'
import ParticleBackground from '@/components/background/ParticleBackground.vue'
import AnimatedGradient from '@/components/background/AnimatedGradient.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import TopBar from '@/components/layout/TopBar.vue'

const settingsStore = useSettingsStore()
const profitStore = useProfitStore()

onMounted(() => {
  // Load seed data if first visit
  profitStore.loadSeedDataIfEmpty()
  
  // Apply theme
  document.documentElement.setAttribute('data-theme', settingsStore.theme)
})
</script>

<template>
  <div class="app-root" :data-theme="settingsStore.theme">
    <!-- Background Layer 1: Animated Gradient Mesh -->
    <AnimatedGradient />
    
    <!-- Background Layer 2: Interactive Particles -->
    <ParticleBackground
      v-if="settingsStore.particlesEnabled"
      :density="settingsStore.particleDensity"
    />
    
    <!-- Content Layer -->
    <div class="app-shell">
      <AppSidebar />
      
      <div class="app-main">
        <TopBar />
        
        <main class="app-content">
          <router-view v-slot="{ Component, route }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.app-shell {
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100vh;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  min-height: 100vh;
  transition: margin-left var(--transition-normal);
}

.app-content {
  flex: 1;
  padding: 1.5rem 2rem 2rem;
  max-width: 1600px;
}

/* Page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1024px) {
  .app-main {
    margin-left: 72px;
  }
  
  .app-content {
    padding: 1rem 1.25rem 1.5rem;
  }
}
</style>
