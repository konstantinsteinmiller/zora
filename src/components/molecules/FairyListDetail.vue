<script setup lang="ts">
import ElementImg from '@/components/atoms/ElementImg.vue'
import $ from '@/global.ts'

const props = defineProps({
  fairy: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})
</script>

<template lang="pug">
  div.fairy-list-detail.flex.flex-col.relative.w-full.h-full.items-center.justify-center
    img.fancy-frame.absolute.top-0.left-0(
      src="/images/frames/fancy-frame_512x128.png" alt="frame"
      class="h-24 w-[320px] -mt-1"
    )
    div.absolute.top-0.left-2.text-blue-500.text-lg(
      class="!text-[14px] !font-bold !text-center translate-y-[-2px]"
      style="text-shadow: 0 0 8px #ffffffff;"
    ) {{ index + 1 }}.
    img.normal-frame.absolute.top-0.left-0(
      src="/images/frames/frame-avatar_128x144.png" alt="frame"
      class="h-[72px] w-[72px] ml-2 mt-1"
    )
    //.glass.card.dark.frame
    img.self-start.rounded-full(v-if="fairy?.avatar"
      :src="fairy.avatar" :alt="`${fairy.name} image`"
      class="h-[64px] w-[64px] ml-3 mt-3"
    )
    div.absolute.left-20.top-1.flex.flex-col.justify-center.gap-1(class="w-[180px] ml-[2px]")
      div.flex.items-center.gap-2
        ElementImg(:type="fairy.element" class="w-6 h-5 ml-[2px]")
        div.rib.text-sm {{ fairy.name }}
      div.rib.text-sm.text-sm.flex.gap-2.justify-between.items-center(class="!text-[12px]")
        div.flex.items-center.gap-2
          img.self-start(
            src="/images/icons/heart_128x128.png" alt="heart image"
            class="h-4 w-5 ml-1 mt-[4px]" style="filter: grayscale(40%)"
          )
          div(class="ml-[2px]" :class="{'text-red-500': $.options.coloredUI }") {{ fairy.stats.hp }} / {{ fairy.stats.maxHp }}

        div.flex.items-center.gap-2
          img.self-start(
            src="/images/icons/mana_48x116.png" alt="mana image"
            class="h-6 w-3 ml-2 -mr-[2px] -mt-[4px]"
          )
          div(:class="{'text-blue-600': $.options.coloredUI }") {{ fairy.stats.mp }} / {{ fairy.stats.maxMp }}
      div.level.rib.flex.gap-2.items-center.justify-end(class="!text-[12px]")
        //div.ml-2(class="!text-[14px]" :class="{'text-yellow-300': $.options.coloredUI }") L-{{ fairy.level }}

        div.justify-self-end.flex.items-center.gap-2
          img.self-start(
            src="/images/icons/xp_256x256.png" alt="xp image"
            class="h-5 w-5 ml-1"
            style="filter: drop-shadow(0 0 2px #ffffffff);"
          )
          div {{ fairy.xp }} / {{ fairy.nextLevelXp }}

    div.rib.absolute.-bottom-5.left-8.text-lg(
      class="!text-[14px] !font-bold !text-center translate-y-[-2px]"
      :class="{'!left-9': fairy.level < 10, 'text-yellow-300': $.options.coloredUI }"
    )
      div.relative.bg-black.bg-opacity-70.px-1.h-4.bottom-2
        img.frame.absolute.bottom-0.left-0(
          src="/images/frames/frame-simple_128x128.png" alt="frame"
          class="h-4 w-16 -mt-1 scale-[120%]"
        )
        div.z-20(class="-translate-y-[5px]") {{ fairy.level }}
</template>

<style scoped lang="sass"></style>
