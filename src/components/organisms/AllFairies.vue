<script setup lang="ts">
import AllFairyDetail from '@/components/molecules/AllFairyDetail.vue'
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
</script>

<template lang="pug">
  div.h-full.relative.flex.justify-end(v-if="showAllFairyList" class="w-full h-full")
    div.flex.flex-col.gap-2(class="w-[380px] z-100")
      draggable(
        v-model="draggableFairies"
        group="fairies"
        item-key="id"
        draggable=".all-fairy-detail"
        ghost-class="all-fairy-detail"
        @start="onDragStartFairy"
        @dragover="onDragOverFairy"
        @end="onEndFairy"
        class="all-fairies-list flex flex-col gap-4 w-full"
      )
        template(v-slot:item="{ element, index }")
          AllFairyDetail(
            :fairy="element" :key="element.id"
            class="draggable cursor-grab"
            :data-index="index"
          )
</template>

<style scoped lang="sass"></style>

<style lang="sass">
.fairies-list .fairy-list-detail .all-fairy-detail-avatar
  transform: translateX(0.75rem)

.fairies-list .fairy-list-detail .all-fairy-detail-stats
  transform: translateX(-0.5rem) scale(0.75)

.fairies-list .fairy-list-detail .all-fairy-detail-header
  transform: translateX(-0.125rem)

.fairies-list .fairy-list-detail .all-fairy-detail-avatar .avatar-img
  width: 66px
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
