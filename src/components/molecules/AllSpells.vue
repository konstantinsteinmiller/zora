<script setup lang="ts">
import SpellIcon from '@/components/atoms/SpellIcon.vue'
import StatRating from '@/components/atoms/StatRating.vue'
import $ from '@/global.ts'
import type { AttackSpell, Spell } from '@/types/spells.ts'
import useDraggable, { draggedUponFairy, targetSpell } from '@/use/useDraggable.ts'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { clamp } from 'three/src/math/MathUtils.js'

const { t } = useI18n()

const spellsList = ref<(Spell | AttackSpell)[]>($.player.spells.spellsList)
const selectedSpell = ref<Spell | AttackSpell | null>(null)
const isAttackSpell = computed(() => {
  return selectedSpell.value?.speed !== undefined && selectedSpell.value?.name
})
const isPassiveSpell = computed(() => {
  return selectedSpell.value?.speed === undefined && selectedSpell.value?.mana >= 0 && selectedSpell.value?.name
})
const selectedSpellDamage = computed(() => Math.ceil(selectedSpell.value?.damage / 5))

const { draggedSpell, draggedFromActiveFairySpells } = useDraggable(spellsList, 'all-spells-list')

const onDragStartAllSpell = (event: any) => {
  const draggedElement = event.item._underlying_vm_

  if (draggedElement) {
    draggedSpell.value = draggedElement as Spell | AttackSpell
    draggedFromActiveFairySpells.value = false
    // console.log('AllSpell drag start:', draggedSpell.value?.name, 'from index:', event.oldIndex)
  }
}

const onEndAllSpell = (event: any) => {
  draggedSpell.value = null
  draggedFromActiveFairySpells.value = false
  targetSpell.value = null
  draggedUponFairy.value = null
  // console.log('AllSpell drag end.')
}
</script>

<template lang="pug">
  div.all-spells.flex.flex-col.relative.w-full.items-start.justify-start
    draggable(
      v-model="spellsList"
      :group="{ name: 'spells', pull: false, put: false }"
      item-key="name"
      draggable=".all-spell-handle"
      ghost-class="spell-icon-ghost"
      @start="onDragStartAllSpell"
      @end="onEndAllSpell"
      class="all-spells-list flex flex-wrap flex-shrink-1 p-2 gap-1 gap-y-1 items-start justify-start max-h-[460px] overflow-auto"
    )
      template(v-slot:item="{ element, index }")
        div.all-spell-handle.flex.w-20.h-20.relative.cursor-grab(class="p-[2px]" @click="selectedSpell = element")
          img.absolute.top-0.left-0(v-if="selectedSpell?.name === element.name"
            src="/images/frames/frame-selected_128x128.png" alt="frame"
            class="w-[80px] h-[80px] scale-[110%]"
          )
          SpellIcon(
            class="draggable"
            :spell="element" :key="element.name"
            :index="index"
            :data-index="index"
          )
    div.flex.flex-col.mx-2
      div.rib.text-lg {{ t(selectedSpell?.name || '') || '' }}
      div.grid.grid-cols-3.mx-2.mt-2.text-base(v-if="isAttackSpell")
        div.max-w-48.min-w-48 {{ t('stats.damage') }}:
        StatRating.col-span-2(:amount="clamp(selectedSpellDamage, 0, 5)")
        div.max-w-48.min-w-48 {{ t('stats.mana') }}:
        StatRating.col-span-2(:amount="clamp(Math.ceil(selectedSpell.mana / 2.5), 0, 5)")
        div.max-w-48.min-w-48 {{ t('stats.fireRate') }}:
        StatRating.col-span-2(:amount="clamp(Math.ceil(selectedSpell.speed * 2), 0, 5)")
        template.text-base(v-if="selectedSpell?.criticalHitText")
          div.max-w-48.min-w-48 {{ t('stats.criticalHit') }}:
          div.col-span-2 {{ t(selectedSpell?.criticalHitText || '') }}
      div.grid.grid-cols-3.mx-2.mt-2.text-base(v-if="isPassiveSpell")
        div.max-w-48.min-w-48 {{ t('stats.mana') }}:
        StatRating.col-span-2(:amount="clamp(Math.ceil(selectedSpell.mana / 2.5), 0, 5)")
        template.text-base(v-if="selectedSpell?.effectText")
          div.max-w-48.min-w-48 {{ t('stats.effect') }}:
          div.col-span-2 {{ t(selectedSpell?.effectText || '') }}
</template>

<style scoped lang="sass">
.all-spell-handle
  position: relative
  z-index: 10
.all-spells-list
  &::-webkit-scrollbar
    width: 12px /* For vertical scrollbars */
    height: 12px /* For horizontal scrollbars */
    background-color: transparent
    border: solid 1px #a58a4b
    border-radius: 12px
  &::-webkit-scrollbar-thumb
    background-color: rgba(182, 152, 101, 0.34)
    border-radius: 6px
    border: solid 1px #a58a4b
  &::-webkit-scrollbar-thumb:hover
    background-color: rgba(223, 192, 120, 0.85)

.spell-icon-ghost
  opacity: 0.4
  border: 2px dashed #762ae4
  background-color: transparent
  .all-spell-handle
    display: none
  .fairy-spell-handle
    display: none
</style>
