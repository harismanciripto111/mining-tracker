import { ref, watch, onMounted } from 'vue'

export function useAnimatedCounter(
  targetValue: () => number,
  duration = 800,
  decimals = 2
) {
  const displayValue = ref(0)
  let animationFrame: number | null = null

  function animate(from: number, to: number) {
    if (animationFrame) cancelAnimationFrame(animationFrame)

    const startTime = performance.now()
    const diff = to - from

    function step(currentTime: number) {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      displayValue.value = parseFloat((from + diff * eased).toFixed(decimals))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step)
      } else {
        displayValue.value = parseFloat(to.toFixed(decimals))
      }
    }

    animationFrame = requestAnimationFrame(step)
  }

  onMounted(() => {
    animate(0, targetValue())
  })

  watch(targetValue, (newVal, oldVal) => {
    animate(oldVal ?? 0, newVal)
  })

  return { displayValue }
}
