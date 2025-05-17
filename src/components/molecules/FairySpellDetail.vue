<script setup lang="ts">
import SpellIcon from '@/components/atoms/SpellIcon.vue'
import $ from '@/global.ts'
import { useI18n } from 'vue-i18n'

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
const { t } = useI18n()
</script>

<template lang="pug">
  div.fairy-spell-detail.relative(class="" :class="{ 'ml-1': index === 2}")
    div.frame.w-20.h-20.mt-8.relatvie
      div.absolute.w-20.h-20.mt-2(class="p-[2px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]")
        SpellIcon(
          :spell="spell"
          class=""
        )
        img.absolute.top-0.left-0.frame(
          src="/images/frames/frame-simple_128x128.png" :alt="`spell frame`"
          class="w-[80px] h-[80px] z-20"
        )

    div.absolute.-bottom-2.left-0(class="!text-[9px] text-center w-full") {{ spell?.element && t(spell?.name) }}

</template>

<style scoped lang="sass"></style>
