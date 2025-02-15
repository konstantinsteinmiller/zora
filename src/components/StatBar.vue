<template>
  <div
    class="w-[18%] h-[3.5%] p-[0.125%] absolute border-[#A5A9B4] border-solid border-[2px] rounded-full bg-opacity-70"
    :class="containerClasses"
    style=""
  >
    <div class="relative h-full rounded-full overflow-hidden">
      <div
        class="relative current-hp h-full z-10"
        :class="barClasses"
        :style="{
          width: `${percentage}%`,
        }"
      />
      <div
        class="pre-loss-hp absolute top-0 left-0 h-full z-0 bg-opacity-80"
        :class="lossClasses"
        :style="{
          width: `${lossPercentage}%`,
        }"
      />
      <div class="flex justify-between items-center basis-1/4 absolute top-0 left-0 w-full h-full z-10">
        <div
          v-for="(separator, index) in ['', '', '', '']"
          :key="index"
          class="border-solid border-[#A5A9B4] h-full top-[0.125%] w-1/4 grow-1 shrink-0"
          :class="{
            'border-r-[1px]': index < 3,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import state from '@/states/GlobalState.ts'
import { lerp, clamp } from 'three/src/math/MathUtils'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  ownerId: { type: String, required: true },
  type: { type: String, default: 'life' },
})

const owner: any = ref({
  hp: 100,
  previousHp: 100,
  maxHp: 100,
  mp: 100,
  previousMp: 100,
  maxMp: 100,
  endurance: 100,
  previousEndurance: 100,
  maxEndurance: 100,
})

let counter = 0
let current = -1
let target = -1
let totalDist = -1
const ANIMATION_SPEED = 8
let condition = false
let typeSelectionList: any[] = []

const updateCallback = (deltaTimeInS: number) => {
  counter++

  if (props.type === 'life') {
    const { hp, previousHp, maxHp } = state?.[props.ownerId]
    typeSelectionList = [hp, previousHp, maxHp, 'hp', 'previousHp', 'maxHp']
    condition = target !== hp
  }
  if (props.type === 'mana') {
    const { mp, previousMp, maxMp } = state?.[props.ownerId]
    typeSelectionList = [mp, previousMp, maxMp, 'mp', 'previousMp', 'maxMp']
    condition = target !== mp
  }
  if (props.type === 'endurance') {
    const { endurance, previousEndurance, maxEndurance } = state?.[props.ownerId]
    typeSelectionList = [endurance, previousEndurance, maxEndurance, 'endurance', 'previousEndurance', 'maxEndurance']
    condition = target !== endurance
  }

  if (condition) {
    current = typeSelectionList[1]
    target = typeSelectionList[0]
    totalDist = Math.abs(target - current)
    // console.log('targetHp, current: ', target, current)
    owner.value = {
      [typeSelectionList[3]]: typeSelectionList[1],
      [typeSelectionList[4]]: typeSelectionList[1],
      [typeSelectionList[5]]: typeSelectionList[2],
    }
  }
  if (counter % 8 === 0 && current !== target) {
    const dist: number = +clamp(Math.abs(target - current), 0.1, 100).toFixed(1)
    const delta = +clamp(deltaTimeInS * (totalDist / dist) * ANIMATION_SPEED, 0.01, 1).toFixed(3)
    if (dist <= 1) {
      current = target
      owner.value[typeSelectionList[3]] = target
      owner.value[typeSelectionList[4]] = target
      return
    }
    // console.log('dist: ', dist, delta)
    const newHp = +clamp(lerp(current, target, delta), 0, typeSelectionList[2]).toFixed(1)

    current = newHp
    owner.value[typeSelectionList[3]] = current
  }
}
state.addEvent('renderer.update', updateCallback)

watch(
  () => owner.value,
  () => {
    // console.log('owner.value: ', owner.value)
  },
  { deep: true }
)

const barClasses = computed(() => ({
  'bg-red-700': props.type === 'life',
  'bg-red-800': props.type === 'life' && props.ownerId === 'enemy',
  'bg-blue-700': props.type === 'mana',
  'bg-green-700': props.type === 'endurance',
}))
const lossClasses = computed(() => ({
  'bg-red-500': props.type === 'life',
  'bg-blue-500': props.type === 'mana',
  'bg-green-500': props.type === 'endurance',
}))
const containerClasses = computed(() => ({
  [`${props.ownerId}-${props.type}-bar`]: true,
  'bg-red-300 bottom-4 left-4': props.type === 'life',
  'bg-blue-300 bottom-4 right-4': props.type === 'mana',
  'bg-green-300 bottom-4 right-1/2 transform translate-x-1/2': props.type === 'endurance',
  'opacity-0 bg-red-300 ': props.ownerId === 'enemy',
}))

const percentage = computed(() => (owner.value[typeSelectionList[3]] / owner.value[typeSelectionList[5]]) * 100)
const lossPercentage = computed(() => (owner.value[typeSelectionList[4]] / owner.value[typeSelectionList[5]]) * 100)
</script>

<style scoped lang="sass"></style>
