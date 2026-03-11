<script setup lang="ts">
// Pure CSS animated gradient mesh - no JS overhead
</script>

<template>
  <div class="animated-gradient">
    <div class="gradient-orb gradient-orb--1"></div>
    <div class="gradient-orb gradient-orb--2"></div>
    <div class="gradient-orb gradient-orb--3"></div>
    <div class="gradient-orb gradient-orb--4"></div>
    <div class="gradient-noise"></div>
  </div>
</template>

<style scoped>
.animated-gradient {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  background: var(--bg-primary);
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  will-change: transform;
}

.gradient-orb--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  top: -10%;
  left: -5%;
  animation: float-1 25s ease-in-out infinite;
}

.gradient-orb--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
  top: 50%;
  right: -10%;
  animation: float-2 30s ease-in-out infinite;
}

.gradient-orb--3 {
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, #06b6d4 0%, transparent 70%);
  bottom: -15%;
  left: 30%;
  animation: float-3 20s ease-in-out infinite;
}

.gradient-orb--4 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #a78bfa 0%, transparent 70%);
  top: 30%;
  left: 50%;
  animation: float-4 35s ease-in-out infinite;
}

/* Subtle noise texture overlay */
.gradient-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

@keyframes float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(80px, 50px) scale(1.1); }
  50% { transform: translate(30px, 100px) scale(0.95); }
  75% { transform: translate(-40px, 60px) scale(1.05); }
}

@keyframes float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(-60px, -40px) scale(1.08); }
  50% { transform: translate(-100px, 20px) scale(0.92); }
  75% { transform: translate(-30px, -80px) scale(1.03); }
}

@keyframes float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(60px, -50px) scale(1.1); }
  66% { transform: translate(-40px, -30px) scale(0.9); }
}

@keyframes float-4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  20% { transform: translate(-50px, 30px) scale(1.15); }
  40% { transform: translate(30px, -60px) scale(0.85); }
  60% { transform: translate(-80px, -20px) scale(1.1); }
  80% { transform: translate(20px, 50px) scale(0.95); }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .gradient-orb {
    animation: none !important;
  }
}
</style>