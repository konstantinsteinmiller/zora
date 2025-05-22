<script setup lang="ts">
import SpellIcon from '@/components/atoms/SpellIcon.vue'
import { activeSpellSlotIndex } from '@/control/ControlActions.ts'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import $ from '@/global.ts'

let updateUuid: string = ''

const setSelectedSpells = () => {
  return [
    $?.player?.fairy?.attackSpells?.[activeSpellSlotIndex.value] || null,
    $?.player?.fairy?.passiveSpells?.[activeSpellSlotIndex.value] || null,
  ]
}
const selectedSpells = ref(setSelectedSpells())

watch(activeSpellSlotIndex, () => {
  selectedSpells.value = setSelectedSpells()
})

onMounted(() => {
  updateUuid = $.addEvent('renderer.update', () => {
    if ($?.player?.fairy?.attackSpells.length && activeSpellSlotIndex.value === 2) {
      activeSpellSlotIndex.value = 0
      selectedSpells.value = setSelectedSpells()
      $.removeEvent('renderer.update', updateUuid)
      updateUuid = ''
    }
  })
})

onUnmounted(() => {
  updateUuid && $.removeEvent('renderer.update', updateUuid)
})
</script>

<template lang="pug">
  div.fixed.left-0.w-screen.h-20.flex.justify-between(class="bottom-[72px]")
    div.relative.flex.justify-start.items-center.ml-4(class="")
      img.absolute.w-24.h-24(
        src="/images/frames/frame-half_128x128.png" alt="frame-half" class=""
        :class="{ 'rotate-[180deg] -top-4 left-4': activeSpellSlotIndex === 1, 'top-0 left-0': activeSpellSlotIndex === 0 }"
      )
      SpellIcon.ml-4.mt-0(
        v-if="selectedSpells?.[0]"
        :spell="selectedSpells[0]"
        class="w-[76px]"
      )
    div.relative.flex.justify-end.items-center.ml-4.-mt-3
      img.absolute.w-24.h-24.pointer-events-none(
        src="/images/frames/frame-half_128x128.png" alt="frame-half" class=""
        :class="{ 'rotate-[180deg] top-1 left-0': activeSpellSlotIndex === 0, 'top-4 -left-4': activeSpellSlotIndex === 1 }"
      )
      SpellIcon.mr-4.mt-6(
        v-if="selectedSpells?.[1]"
        :spell="selectedSpells[1]"
        class="h-[76px] w-[76px]"
      )
</template>

<style scoped lang="sass"></style>
