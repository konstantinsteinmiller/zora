<script setup lang="ts">
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
</template>

<style scoped lang="sass"></style>
