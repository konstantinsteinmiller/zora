<template>
  <div class="absolute right-2 top-2 flex gap-2">
    <div
      v-for="buff in buffProgressList"
      :key="buff.name"
      class="h-16 w-16 p-2 relative"
    >
      <img
        :src="buff.img"
        :alt="`buff-${buff.name}`"
        class="w-full h-full p-1"
      />
      <div
        class="timer absolute left-0 top-0 h-16 w-16 rounded-full pointer-events-none box-border"
        :style="{
          background: `conic-gradient(transparent ${(1 - buff.progress) * 360}deg, rgba(255, 255, 255, 0.3) ${(1 - buff.progress) * 360}deg 360deg)`,
        }"
      />
    </div>
    <div class="fixed right-2 bottom-16 w-10">
      <div class="relative flex flex-col gap-0 items-end justify-center">
        <div class="text-white text-2xl self-center p-2 pb-0">{{ fairyDustCollected }}</div>
        <img
          src="/images/fairy-dust/fairy-dust-100x120.png"
          alt="fairy-dust-icon"
          class="h-12 w-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import $ from '@/global'
import AttackBuffImg from '@/assets/images/buff/swords-128x128.avif'
import DefenseBuffImg from '@/assets/images/buff/breast-plate-128x128.avif'
import { type Ref, ref } from 'vue'

const buffProgressList: Ref<{ progress: number; name: string; finished: boolean; img: any }[]> = ref([])
const fairyDustCollected = ref(0)

const updateBuffs = () => {
  buffProgressList.value = []
  const entity = $.player
  if (!entity?.defense) return
  fairyDustCollected.value = entity.currency.fairyDustCollected

  const defenseBuff = entity.defense.buff
  const attackBuff = entity.currentSpell.buff

  const buffsList = [defenseBuff, attackBuff]

  buffsList.forEach(buff => {
    if (!buff || buff.endTime === 0) return

    const currentTime = Date.now()
    const timeRemaining = buff.endTime - currentTime

    if (timeRemaining <= 0) {
      buff.endTime = 0
      buff.duration = 0
      return
    }

    const progress = timeRemaining / buff.duration // Progress from 1 to 0
    const isRunning = timeRemaining > 0

    const img = buff?.name === 'defense' ? DefenseBuffImg : AttackBuffImg
    buffProgressList.value.push({ progress, name: buff?.name, finished: !isRunning, img })
  })
}

// Add the update event
$.addEvent('renderer.update', updateBuffs)
</script>

<style scoped lang="sass">
.timer
  mask: radial-gradient(transparent 55%, black 45%)
</style>
