<script setup lang="ts">
import ElementImg from '@/components/atoms/ElementImg.vue'
import StatRating from '@/components/atoms/StatRating.vue'
import FairiesList from '@/components/organisms/FairiesList.vue'
import { computed, type ComputedRef, type Ref, ref, onMounted, watch } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

// $.menuItem.value =

interface Fairy {
  name: string
  id: string
  avatar: string
  preview: string
}

const { t } = useI18n()
</script>

<template lang="pug">
  div.flex.gap-2.h-full.pt-6.pb-2.relative(
    v-if="$?.menuItem.value === MENU.FAIRY"
    class="w-full h-full"
  )
    div.glass.card.frame.w-full.p-4.px-6(class="min-w-[298px]")
      FairiesList
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
