<template>
  <div
    class="min-w-32 h-[7%] p-[0.125%] absolute"
    :class="containerClasses"
    style=""
  >
    <div class="relative h-full">
      <img
        v-if="ownerId !== 'enemy'"
        class="ornament absolute top-0 h-full z-50 scale-110"
        :class="ornamentClasses"
        src="/images/stat/stat-ornament.png"
        alt="stat-ornament"
        :style="{
          transform: `translateX(${percentage}%)`,
        }"
      />
      <img
        class="absolute top-0 left-0 h-full z-40 scale-[1.1] -translate-x-[2px]"
        src="/images/stat/stat-frame.png"
        alt="stat-frame"
      />
      <!--  actual value  -->
      <div
        class="bar-container absolute top-0 left-0 h-full overflow-hidden"
        :style="{
          width: `${percentage}%`,
        }"
      >
        <img
          id="bar"
          class="absolute top-0 left-0 h-full z-10 scale-[1.08] -translate-x-[3px]"
          :class="barClasses"
          :src="`/images/stat/stat-${type}.png`"
          alt="life-bar"
        />
      </div>
      <!--  loss value  -->
      <div
        class="absolute top-0 left-0 loss-bar-container h-full overflow-hidden"
        :style="{
          width: `${lossPercentage}%`,
        }"
      >
        <img
          id="bar"
          class="opacity-70 absolute top-0 left-0 h-full z-0 scale-[1.08] -translate-x-[3px]"
          :class="barClasses"
          :src="`/images/stat/stat-${type}.png`"
          alt="life-bar"
        />
      </div>
      <!--  background  -->
      <img
        id="bar"
        class="opacity-40 absolute top-0 left-0 h-full z-10 scale-[1.08] -translate-x-[3px]"
        :class="barClasses"
        :src="`/images/stat/stat-${type}.png`"
        alt="life-bar"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import state from '@/states/GlobalState.ts'
import { lerp, clamp } from 'three/src/math/MathUtils'
import { computed, ref } from 'vue'

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
let entity: any = state?.[props.ownerId]
const uuid = ref('')

const updateCallback = (deltaS: number) => {
  counter++
  entity = state?.[props.ownerId]
  uuid.value = entity?.uuid

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

  /* this branch executed once if damage or heal happens */
  if (condition) {
    current = typeSelectionList[1]
    target = typeSelectionList[0]
    // console.log('current: ', current, target, target - current, Math.abs(target - current))
    totalDist = Math.abs(target - current)
    // console.log('targetHp, current: ', target, current)
    owner.value = {
      [typeSelectionList[3]]: typeSelectionList[1],
      [typeSelectionList[4]]: typeSelectionList[1],
      [typeSelectionList[5]]: typeSelectionList[2],
    }
  }

  if (counter % 5 === 0 && current !== target) {
    const absDist = Math.abs(target - current)
    const dist: number = +clamp(absDist, 0.1, typeSelectionList[2]).toFixed(1)
    const delta = +clamp(deltaS * (totalDist / dist) * ANIMATION_SPEED, 0.01, 1).toFixed(3)

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

const MAX_SIZE = '24vw'
const barClasses = computed(() => ({
  [`min-w-[${MAX_SIZE}] w-[${MAX_SIZE}]`]: true,
}))
const ornamentClasses = computed(() => ({
  [`w-[${MAX_SIZE}] -left-[16px] overflow-visible [${MAX_SIZE}]`]: true,
}))
const containerClasses = computed(() => ({
  [`w-[${MAX_SIZE}]`]: true,
  [`${props.ownerId}-${props.type}-bar`]: true,
  [`entity-${uuid.value}`]: uuid.value,
  ' bottom-1 left-4': props.type === 'life',
  ' bottom-1 right-4': props.type === 'mana',
  ' bottom-1 right-1/2 transform translate-x-1/2': props.type === 'endurance',
  'opacity-0 ': props.ownerId === 'enemy',
}))

const percentage = computed(() => (owner.value[typeSelectionList[3]] / owner.value[typeSelectionList[5]]) * 100)
const lossPercentage = computed(() => (owner.value[typeSelectionList[4]] / owner.value[typeSelectionList[5]]) * 100)
</script>

<style scoped lang="sass"></style>
