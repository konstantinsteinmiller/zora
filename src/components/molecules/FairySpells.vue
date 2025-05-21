<script setup lang="ts">
import SpellIcon from '@/components/atoms/SpellIcon.vue'
import type { AttackSpell, Spell } from '@/types/spells.ts'
import useDraggable, { targetSpell, draggedUponFairy } from '@/use/useDraggable.ts'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

const props = defineProps({
  fairy: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})
const { t } = useI18n()

const emptySpellSlot = { name: 'empty', icon: '' }
const fairySpellsList = ref<(Spell | AttackSpell)[]>([
  props.fairy.spells[0] || emptySpellSlot,
  props.fairy.passiveSpells[0] || emptySpellSlot,
  props.fairy.spells[1] || emptySpellSlot,
  props.fairy.passiveSpells[1] || emptySpellSlot,
])

const { draggedSpell, draggedFromActiveFairySpells } = useDraggable(fairySpellsList, 'fairy-spells-list')
const isDropAllowed = ref<boolean>(false)
const allowedElementsList = ref<string[]>([...(props.fairy.allowedElementsList || [props.fairy.element])])

const onDragStartFairySpell = (event: any) => {
  const draggedElement = event.item._underlying_vm_?.element || event.item.__vueParentComponent?.props?.spell

  if (draggedElement && draggedElement.name !== emptySpellSlot.name) {
    draggedSpell.value = draggedElement as Spell | AttackSpell
    draggedFromActiveFairySpells.value = true
    // console.log('FairySpell drag start:', draggedSpell.value.name, 'from index:', event.oldIndex)

    // Set a data attribute on the dragged element to know its original index
    event.item.dataset.originalIndex = event.oldIndex
  } else {
    // If dragging an empty slot, prevent the drag
    event.preventDefault()
  }
}

const onDropIntoFairySpellSlot = (targetIndex: number) => {
  // console.log('Dropped into FairySpell slot at index:', targetIndex)

  if (draggedSpell.value && !draggedFromActiveFairySpells.value) {
    // Ensure it's from AllSpells and not from active list
    const droppedSpell = draggedSpell.value

    // Handle replacement in fairySpellsList
    // const oldSpellInSlot = fairySpellsList.value[targetIndex]
    // if (oldSpellInSlot.name !== emptySpellSlot.name) {
    //   const isDuplicate = $?.player?.spells.spellsList.value?.some(s => s.name === oldSpellInSlot.name)
    //   if (!isDuplicate) {
    //     $?.player?.spells?.spellsList.value?.push(oldSpellInSlot)
    //     console.log('Returned old spell to AllSpells:', oldSpellInSlot.name)
    //   } else {
    //     console.warn('Skipped returning duplicate spell to AllSpells:', oldSpellInSlot.name)
    //   }
    // }
    // Place the new spell in the slot

    const isDraggedSpellPassiveSpell = draggedSpell.value?.speed === undefined && draggedSpell.value?.mana >= 0
    const isCorrectPassiveSlot = isDraggedSpellPassiveSpell && (targetIndex === 1 || targetIndex === 3)
    const isCorrectAttackSlot = !isDraggedSpellPassiveSpell && (targetIndex === 0 || targetIndex === 2)
    const isDropAllowed = isCorrectAttackSlot || isCorrectPassiveSlot
    const isDraggedSpellAllowed = allowedElementsList.value.includes(draggedSpell.value.element)

    if (isDropAllowed && isDraggedSpellAllowed) {
      fairySpellsList.value[targetIndex] = droppedSpell
      // console.log('Placed new spell:', droppedSpell.name, 'into slot:', targetIndex)
    } else {
      // console.log('Placing not allowed for ', droppedSpell.name, 'into slot:', targetIndex)
    }

    // Reset global drag state
    draggedSpell.value = null
    draggedFromActiveFairySpells.value = false
  }
}

const onEndFairySpell = (event: any) => {
  draggedSpell.value = null
  draggedFromActiveFairySpells.value = false
  targetSpell.value = null
  isDropAllowed.value = false
  // console.log('FairySpell drag end.')
}

const onDragOverFairySpellSlot = (event: DragEvent) => {
  event.preventDefault() // Essential to allow dropping

  targetSpell.value =
    event.target?.__vueParentComponent?.props?.spell || event.target?.__vueParentComponent?.props?.element

  const isDraggedSpellPassiveSpell = draggedSpell.value?.speed === undefined && draggedSpell.value?.mana >= 0
  const isTargetParentPassiveSpell = event.target?.parentNode?.classList?.contains('is-passive-spell')
  draggedUponFairy.value = props.fairy

  isDropAllowed.value = isTargetParentPassiveSpell === isDraggedSpellPassiveSpell
}
</script>

<template lang="pug">
  div.fairy-spells.flex.flex-row.relative.w-full.h-24.items-center.justify-start
    img.fancy-frame.absolute.top-0.left-0(
      src="/images/frames/fancy-frame_512x128.png" alt="frame"
      class="h-32 w-[436px]"
    )
    div.ml-2.relative
      div.absolute.top-0.left-2.text-blue-500.text-lg(
        class="!text-[14px] !font-bold !text-center translate-y-[14px]"
        style="text-shadow: 0 0 8px #ffffffff;"
      ) {{ index + 1 }}.
      img.normal-frame.absolute.top-0.left-0(
        src="/images/frames/frame-avatar_128x144.png" alt="frame"
        class="h-[72px] w-[72px] ml-2 mt-5"
      )
      div.absolute.-bottom-4(class="left-11 translate-x-[-50%]") {{ fairy.name }}
      img.self-start.w-auto.rounded-full(v-if="fairy?.avatar"
        :src="fairy.avatar" :alt="`${fairy.name} image`"
        class="h-[64px] w-[64px] ml-3 mt-7"
      )
    div.flex.justify-center.gap-1(class="ml-4")
      draggable(
        v-model="fairySpellsList"
        :group="{ name: 'spells', pull: false, put: true }"
        item-key="name"
        draggable=".fairy-spell-handle"
        ghost-class="spell-icon-ghost"
        @start="onDragStartFairySpell"
        @end="onEndFairySpell"
        class="fairy-spells-list flex"
      )
        template(v-slot:item="{ element: spell, index }")
          div.fairy-spell.relative(
            :class="{ 'ml-1': index === 2, 'opacity-50': spell.name === emptySpellSlot.name }"
            @dragover.prevent="onDragOverFairySpellSlot"
            @drop="onDropIntoFairySpellSlot(index)"
          )
            div.frame.w-20.h-20.mt-8.relatvie
              div.absolute.w-20.h-20.mt-2(class="p-[2px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]")
                img.absolute.top-0.left-0.frame(
                  src="/images/frames/frame-simple_128x128.png" :alt="`spell frame`"
                  class="w-[80px] h-[80px]"
                )
                div.absolute.w-20.h-20(
                  v-if="spell.name !== emptySpellSlot.name"
                  class="fairy-spell-handle cursor-grab p-[2px] top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                )
                  SpellIcon(
                    :spell="spell"
                    :slot-index="index"
                    :fairy="fairy"
                    class="draggable"
                  )
            div.absolute.-bottom-2.left-0(class="!text-[9px] text-center w-full") {{ spell?.element && t(spell?.name) }}
</template>

<style scoped lang="sass">
.spell-icon-ghost
  opacity: 0.3
  border: 2px dashed #007bff
  background-color: #eaf5ff
  // When the ghost is active, hide the inner SpellIcon by targeting the original element's children
  //.fairy-spell-handle
  //  display: none // This hides the icon from the ghost image itself
</style>
