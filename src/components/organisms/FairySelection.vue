<script setup lang="ts">
import AllFairies from '@/components/organisms/AllFairies.vue'
import FairiesList from '@/components/organisms/FairiesList.vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template lang="pug">
  div.flex.flex-col.gap-2.h-full.pt-6.pb-2.relative(
    v-if="$?.menuItem.value === MENU.FAIRY"
    class="w-full h-full"
  )
    div.flex.gap-2
      h3.rib.text-2xl.font-bold.text-center(class="") {{ t('battleFormation') }}
    div.glass.card.frame.w-full.p-4.px-5.gap-5.flex.justify-between(class="min-w-[298px]")
      FairiesList
      AllFairies
</template>

<style scoped lang="sass"></style>

<i18n>
en:
  battleFormation: "Battle Formation"

de:
  battleFormation: "Kampfaufstellung"
</i18n>
