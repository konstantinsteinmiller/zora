<script setup lang="ts">
import useMatch from '@/use/useMatch.ts'
import { LEVELS } from '@/utils/enums.ts'
import { onMounted, onUnmounted, type Ref, ref } from 'vue'
import $ from '@/global.ts'

const fairyDust: Ref<number> = ref(0)
const { levelType } = useMatch()

let updateUuid: string = ''

onMounted(() => {
  updateUuid = $.addEvent('renderer.update', () => {
    if (fairyDust.value !== $.player?.currency?.fairyDust) {
      fairyDust.value = $.player?.currency?.fairyDust
    }
  })
})

onUnmounted(() => {
  $.removeEvent('renderer.update', updateUuid)
})
</script>

<template>
  <div
    v-if="fairyDust >= 0 /* && !$.isMenu*/"
    class="fixed right-2 bottom-16 w-10 z-[5]"
    :class="{
      '!bottom-2': levelType === LEVELS.WORLD,
    }"
  >
    <div class="relative flex flex-col gap-0 items-end justify-center">
      <div
        class="text-white text-2xl self-center p-2 pb-0 -mb-[4.6rem] -mr-0 z-10"
        style="
          text-shadow:
            0 0 3px black,
            -1px -1px 4px black;
        "
      >
        {{ fairyDust }}
      </div>
      <img
        src="/images/fairy-dust/fairy-dust-100x120.png"
        alt="fairy-dust-icon"
        class="h-12 mb-4 w-auto"
      />
    </div>
  </div>
</template>

<style scoped lang="sass"></style>
