<script setup lang="ts">
import $ from '@/global.ts'

const props = defineProps({
  spell: {
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
  div.fairy-spell-detail.relative(:class="{ 'ml-1': index === 2}")
    //.absolute.-bottom-4.left-0
    img.frame.w-20.h-20.mt-8(src="/images/frames/frame-simple_128x128.png" :alt="`spell frame`" class="")
    div.absolute.-bottom-4.left-0
    | {{ spell.name }}
    //| {{  spell }}
  //div.flex(v-for="spell in fairySpellsList" :key="`spell-${spell?.id || 'none-' + index}`")
</template>

<style scoped lang="sass"></style>
