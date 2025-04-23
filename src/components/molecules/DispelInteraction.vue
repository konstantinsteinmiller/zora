<script setup lang="ts">
import XButton from '@/components/atoms/XButton.vue'
import $ from '@/global.ts'
import useInteraction from '@/use/useInteraction.ts'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { hideDispel } = useInteraction()

/* @TODO: FIX ME */
const hasDispelItem = computed(() => $?.player?.inventory?.hadItem?.('itmi_dispel', 1) || true)

const isVisible: ComputedRef<boolean> = computed(() => $.isDispel.value)
const onClose = () => {
  $.targetToFocus.value?.dispel?.()
  hideDispel()
  $.isBattleStarting.value = false
  // console.log('onClose')
  /* other dispel code */
  /* drop FairyDust here */
}
</script>

<template lang="pug">
  div#talk-interaction.glass.card.p-0.origin-top-center.flex(v-if="isVisible" style="border-radius: 6px" class="!border-x-0 w-[99.5vw] translate-x-[0.25vw] h-32 top-[15%] left-0 !fixed !z-[10]")
    div.flex.items-end.justify-center.p-0.w-full.relative(style="text-shadow: 0 0 5px black")
      XButton(v-if="hasDispelItem" class="mt-3 leading-[1rem] !fixed !z-[20] mb-[0.5rem]" @click="onClose") {{ t('dispel') }}
</template>

<style scoped lang="sass"></style>

<i18n>
en:
  dispel: "Dispel"
de:
  dispel: "Zerstreuen"
</i18n>
