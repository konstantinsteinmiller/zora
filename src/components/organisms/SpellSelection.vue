<script setup lang="ts">
import AllSpells from '@/components/molecules/AllSpells.vue'
import FairySpells from '@/components/molecules/FairySpells.vue'
import $ from '@/global'
import type { Fairy } from '@/types/fairy.ts'
import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentFairies: Ref<Fairy[]> = $.player?.fairiesList || ref([])
// console.log('currentFairies: ', currentFairies)
</script>

<template lang="pug">
  div(
    v-if="$?.menuItem?.value?.endsWith('Spells')"
    class=""
  )
    div.flex.flex-col.gap-2.h-full.mt-6.relative
      div.flex.gap-2
        //h3.rib.text-2xl.font-bold.text-center(class="") {{ t('spellSelection') }}
      div.glass.card.frame.w-full.p-4.px-6.flex(class="min-w-[438px] pb-12")
        div.flex.flex-col.gap-8.flex-grow(class="min-w-[438px]")
          FairySpells(v-for="(fairy, index) in currentFairies"
            :key="fairy.id"
            :fairy="fairy"
            :index="index"
          )
        AllSpells
</template>

<style scoped lang="sass"></style>

<i18n>
en:
  spellSelection: "Spell Selection"
de:
  spellSelection: "Spruch Auswahl"
</i18n>
