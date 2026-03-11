<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  density?: number
}>(), {
  density: 50
})

const particleOptions = computed(() => ({
  fullScreen: false,
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'grab'
      },
      onClick: {
        enable: true,
        mode: 'push'
      },
      resize: { enable: true }
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 0.4,
          color: '#06b6d4'
        }
      },
      push: {
        quantity: 2
      },
      repulse: {
        distance: 150,
        duration: 0.4
      }
    }
  },
  particles: {
    color: {
      value: ['#06b6d4', '#8b5cf6', '#22d3ee', '#a78bfa']
    },
    links: {
      color: '#06b6d4',
      distance: 150,
      enable: true,
      opacity: 0.12,
      width: 1
    },
    move: {
      direction: 'none' as const,
      enable: true,
      outModes: {
        default: 'bounce' as const
      },
      random: true,
      speed: 0.8,
      straight: false
    },
    number: {
      density: {
        enable: true,
        width: 1920,
        height: 1080
      },
      value: Math.round(props.density * 1.2)
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false
      }
    },
    shape: {
      type: 'circle'
    },
    size: {
      value: { min: 1, max: 3 },
      animation: {
        enable: true,
        speed: 1,
        sync: false
      }
    }
  },
  detectRetina: true
}))
</script>

<template>
  <div class="particle-background">
    <vue-particles
      id="tsparticles"
      :options="particleOptions"
    />
  </div>
</template>

<style scoped>
.particle-background {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle-background :deep(#tsparticles) {
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>