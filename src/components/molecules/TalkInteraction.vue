<script setup lang="ts">
import Key from '@/components/atoms/KeyboardKey.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template lang="pug">
  div#talk-interaction.billboard.glass.card.p-1.pointer-events-none.origin-top-center.flex(class="w-fit !fixed z-[5] translate-x-[-50%]" style="left:0; right:0")
    div.gap-2.flex.items-center.p-1.pr-2.text-white.text-xl.flex-shrink-1.w-fit(style="text-shadow: 0 0 5px black")
      Key(k="KeyF")
      | {{ t('talk') }}
</template>

<style scoped lang="sass"></style>

<i18n>
en:
  talk: "Talk"
de:
  talk: "Unterhalten"
</i18n>
