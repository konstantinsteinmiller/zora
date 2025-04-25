<script setup lang="ts">
import { ref } from 'vue'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

$.isFairyCollection = ref(true)

interface Fairy {
  name: string
  id: string
  avatar: string
  preview: string
}

const { t } = useI18n()
</script>

<template lang="pug">
  div(
    v-if="$?.menuItem?.value?.endsWith('Spells')"
    class=""
  )
    div.flex.gap-2.h-full.mt-16.relative
      div.glass.card.frame.w-full.mr-8.p-4.px-6(class="min-w-[298px]")

</template>

<style scoped lang="sass">
.rib
  & *, &
    font-family: 'Ribeye', serif
</style>

<i18n>
en:
  fairyCollection: "Fairy Collection"
  type: "Type"
  hp: "Hp"
  defense: "Defense"
  speed: "Speed"
  special: "Special Ability"
de:
  fairyCollection: "Feen Sammlung"
  type: "Typ"
  hp: "Hp"
  defense: "Verteidigung"
  speed: "Geschwindigkeit"
  special: "Spezialfähigkeit"
</i18n>
