<script setup lang="ts">
import { type Ref, ref, onMounted, onUnmounted, computed } from 'vue'
import $ from '@/global'
import { Vector3 } from 'three'

const showDamage: Ref<boolean> = ref(false)
const damageNumber: Ref<number> = ref(0)
const damagePositionX: Ref<number> = ref(0)
const damagePositionY: Ref<number> = ref(0)
const animationTimeout: Ref<number | null> = ref(null)
const wobbleStrength: Ref<number> = ref(2) // Adjust for more/less wobble
const wobbleSpeed: Ref<number> = ref(10) // Adjust for faster/slower wobble
const startTime: Ref<number> = ref(0)
const animationInterval: Ref<number | null> = ref(null)
const currentTimeReactive: Ref<number> = ref(performance.now())

const wobblingPositionX = computed(() => {
  if (!showDamage.value) return damagePositionX.value
  const elapsedTime = (currentTimeReactive.value - startTime.value) / 1000 // in seconds
  return damagePositionX.value + Math.sin(elapsedTime * wobbleSpeed.value) * wobbleStrength.value
})

const floatingPositionY = computed(() => {
  if (!showDamage.value) return damagePositionY.value
  const elapsedTime = (currentTimeReactive.value - startTime.value) / 1000 // in seconds
  // Linear float upwards over 1.5 seconds
  const floatAmount = Math.min(1, elapsedTime / 1.5)
  return damagePositionY.value - floatAmount * 100 // Adjust '50' for float distance
})

const handleDamage = () => {
  if ($.hitTarget.value && $.hitTarget.value.damage >= 0) {
    damageNumber.value = $.hitTarget.value.damage
    showDamage.value = true

    const hitTargetWorldPosition = new Vector3().copy($.hitTarget.value.position).add(new Vector3(0, 1.9, 0))

    // Convert 3D position to 2D screen space
    const screenPosition = hitTargetWorldPosition.clone().project($.camera)
    const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth
    const y = (1 - (screenPosition.y * 0.5 + 0.5)) * window.innerHeight

    damagePositionX.value = x
    damagePositionY.value = y
    startTime.value = performance.now()
    currentTimeReactive.value = performance.now() // Reset reactive time

    // Reset damage value on hit target
    $.hitTarget.value.damage = -1

    // Clear any existing timeout and interval
    if (animationTimeout.value) {
      clearTimeout(animationTimeout.value)
      animationTimeout.value = null
    }
    if (animationInterval.value) {
      clearInterval(animationInterval.value)
      animationInterval.value = null
    }

    // Set an interval to update the reactive current time for animations
    animationInterval.value = setInterval(() => {
      currentTimeReactive.value = performance.now()
    }, 16) // Approximately 60 FPS

    // Set a timeout to hide the damage number and clear the interval after 1.5 seconds
    animationTimeout.value = setTimeout(() => {
      showDamage.value = false
      if (animationInterval.value) {
        clearInterval(animationInterval.value)
        animationInterval.value = null
      }
    }, 1500)
  }
}

const onRendererUpdate = () => {
  handleDamage()
}

let updateUuid = $.addEvent('renderer.update', onRendererUpdate)
onMounted(() => {
  updateUuid = $.addEvent('renderer.update', onRendererUpdate)
})
onUnmounted(() => {
  $.removeEvent('renderer.update', updateUuid)

  if (animationTimeout.value) {
    clearTimeout(animationTimeout.value)
  }
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
  }
})
</script>

<template lang="pug">
  div.fixed(
    v-if="showDamage"
    style="font-family: Asset; filter: drop-shadow(0 0 5px #353535); z-index: 100; pointer-events: none;"
    :style="{ left: wobblingPositionX + 'px', top: floatingPositionY + 'px', transform: 'translate(-50%, -50%)' }"
    class="text-white text-[1.5rem] font-bold"
  )
    | {{ damageNumber }}
</template>

<style scoped lang="sass"></style>
