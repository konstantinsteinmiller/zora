<template>
  <div class="progress-bar absolute w-24 h-24 min-w-12 min-h-12 bg-gray-70">
    <div class="outer glass rounded-full w-full h-full" />
    <span :class="`pin pin2 w-[15px] h-[15px] absolute`" />
    <div
      class="inner absolute bg-transparent left-0 top-0 rounded-full z-[102] w-[94px] h-[94px] flex justify-center items-center"
    />
    <div
      class="inner-circle glass absolute bg-red left-4 top-4 w-16 h-16 rounded-full"
      :class="{
        'with-bg': showPercentage,
      }"
    >
      <span
        v-if="showPercentage"
        :class="`number text-white z-[103] text-xl text-bold absolute
          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`"
        >{{ percentStr }}</span
      >
      <!--    top-[16.5px] right-1/2-->
    </div>
    <span
      :class="`pin w-[15px] h-[15px] absolute
           `"
    />
  </div>
</template>

<script setup lang="ts">
import { Color } from 'three'
import { lerp } from 'three/src/math/MathUtils.js'
import { computed, ref } from 'vue'

const props = defineProps<{
  current: number
  showPercentage?: boolean
}>()

const deg = computed(() => lerp(0, 360, props.current / 100))

const degree = computed(() => `${deg.value}deg`)
const percent = computed(() => +props.current)
const percentStr = computed(() => `${percent.value}%`)
const startC = ref(new Color().lerpColors(new Color('gold'), new Color('#AF47FA'), 0.02))
const startColor = ref(`#${startC.value.getHexString()}`)
const intermediateColor = computed(() => {
  return deg.value < 15 && deg.value > 0 ? 'transparent' : `#AF47FA`
})
</script>

<style scoped lang="sass">
.progress-bar .glass
  background-color: #CBCAF166
  border: 1px solid var(--glass-color)

.outer
  box-shadow: 6px 6px 10px -1px rgba(0, 0, 0, 0.15), -6px -6px 10px -1px rgba(255, 255, 255, 0.2)
  mask-image: radial-gradient(circle 2rem at center, transparent 99%, black 100%)
.inner
  box-shadow: inset 4px 4px 6px -1px rgba(0, 0, 0, 0.2), -4px -4px 6px -1px rgba(255, 255, 255, 0.2), -0.5px -0.5px 0px rgba(255, 255, 255, 1), 0.5px 0.5px 0px rgba(0, 0, 0, 0.15), 0px 12px 10px -10px rgba(0, 0, 0, 0.05),
  background: conic-gradient(from 0deg, var(--glass-gradient-1) 0%, var(--glass-gradient-2) v-bind(percentStr), transparent v-bind(percentStr), transparent 100%)
  margin: 1px
  mask-image: radial-gradient(circle 2rem at center, transparent 99%, black 100%)
.inner-circle.glass
  border: 1px solid var(--glass-color)
  z-index: 104
  background-color: transparent
  &.with-bg
    background-color: var(--glass-accent-color)
.pin
  position: absolute
  z-index: 101
  top: 16px
  width: 16px
  left: calc(50%)

  transform-origin: 50% 47px
  border-radius: 50%

  transform: translate(-50%, -100%) rotate(v-bind(degree))
  background: conic-gradient(from 0deg, var(--glass-gradient-2) 51%, v-bind(intermediateColor) 51%, v-bind(intermediateColor) 99%, var(--glass-gradient-2) 100%)
.pin2
  z-index: 99
  top: 1rem
  width: 15px
  left: 50.5%
  transform: translate(-50%, -100%) rotate(0)
  background: radial-gradient(circle 0.5rem at center, var(--glass-gradient-1) 50%,v-bind(startColor)  100%)
</style>
