<script setup lang="ts">
import FairySpellsList from '@/components/molecules/FairySpellsList.vue'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template lang="pug">
  div(
    v-if="$?.menuItem?.value?.endsWith('Spells')"
    class=""
  )
    div.flex.flex-col.gap-2.h-full.mt-6.relative
      div.flex.gap-2
        h3.rib.text-2xl.font-bold.text-center(class="") {{ t('spellSelection') }}
      div.glass.card.frame.w-full.p-4.px-6(class="min-w-[298px] h-screen")
        //FairySpellsList

</template>

<style scoped lang="sass">
.rib
  & *, &
    font-family: 'Ribeye', serif
</style>

<i18n>
en:
  spellSelection: "Spell Selection"
de:
  spellSelection: "Spruch Auswahl"
</i18n>
