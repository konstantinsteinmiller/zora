<script setup lang="ts">
import FairyListDetail from '@/components/molecules/FairyListDetail.vue'
import type { Fairy } from '@/types/fairy.ts'
import { computed } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import useMenu from '@/use/useDraggable.ts'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

const { t } = useI18n()

const fairyViewList = [MENU.FAIRY, MENU.ATTACK_SPELLS, MENU.PASSIVE_SPELLS, MENU.ITEMS]

const showFairyList = computed(() => {
  return fairyViewList.includes($?.menuItem?.value)
})

const draggableFairies: Ref<Fairy[]> = $.player.fairiesList
const { onDragStartFairy, onDragOverFairy, onEndFairy, onDropFairy } = useMenu(draggableFairies, 'fairies-list')
</script>

<template lang="pug">
  div.h-full.relative(v-if="showFairyList" class="w-full h-full")
    div.flex.flex-col.gap-6(class="w-[270px]")
      draggable(
        v-model="draggableFairies"
        group="fairies"
        item-key="id"
        draggable=".fairy-list-detail"
        ghost-class="fairy-list-detail-ghost"
        @start="onDragStartFairy"
        @dragover="onDragOverFairy"
        @end="onEndFairy"
        @change="onDropFairy"
        class="fairies-list flex flex-col gap-6 w-full"
      )
        template(v-slot:item="{ element, index }")
          FairyListDetail(
            class="fairy-list-detail draggable fairy-list-detail-ghost cursor-grab"
            :fairy="element" :key="element.id"
            :index="index"
            :data-index="index"
          )
</template>

<style scoped lang="sass">
.fairy-list-detail.draggable
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
