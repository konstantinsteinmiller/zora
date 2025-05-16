<script setup lang="ts">
import FairyDetail from '@/components/molecules/FairyDetail.vue'
import type { Fairy } from '@/types/fairy.ts'
import useMenu from '@/use/useDraggable.ts'
import { computed, type Ref } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

const { t } = useI18n()

const showAllFairyList = computed(() => {
  return $?.menuItem?.value === MENU.FAIRY
})

const draggableFairies: Ref<Fairy[]> = $.player.allFairiesList
const { onDragStartFairy, onDragOverFairy, onEndFairy } = useMenu(
  draggableFairies,
  $.player.allFairiesList,
  'all-fairies-list'
)

// const onEnd = (event: any) => {
//   // Update the global list when dragging ends
//   isDragging.value = false
//   $.player.allFairiesList.value = [...draggableFairies.value]
// }
</script>

<template lang="pug">
  //.card.glass.frame
  div.h-full.relative.flex.justify-end(v-if="showAllFairyList" class="w-full h-full")
    div.flex.flex-col.gap-2(class="w-[380px] z-100")
      draggable(
        v-model="draggableFairies"
        group="fairies"
        item-key="id"
        draggable=".fairy-detail"
        ghost-class="fairy-detail-ghost"
        @start="onDragStartFairy"
        @dragover="onDragOverFairy"
        @end="onEndFairy"
        class="all-fairies-list flex flex-col gap-4 w-full"
      )
        template(v-slot:item="{ element, index }")
          FairyDetail(
            :fairy="element" :key="element.id"
            class="fairy-detail draggable fairy-detail-ghost cursor-grab"
            :data-index="index"
          )
</template>

<style scoped lang="sass">
.fairy-detail.draggable
  user-drag: element!important
  user-select: all!important
  -webkit-user-select: all!important
  -webkit-user-drag: element!important
  -moz-user-select: all!important
  -ms-user-select: all!important
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
