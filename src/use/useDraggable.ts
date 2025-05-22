import $ from '@/global.ts'
import type { Fairy } from '@/types/fairy.ts'
import type { Spell } from '@/types/spells.ts'
import { ref, type Ref } from 'vue'

export const draggedElement: Ref<any> = ref(null)
export const cutoutElement: Ref<any> = ref(null)
export const isDragging: Ref<boolean> = ref(false)
export const draggedSpell: Ref<any> = ref(null)
export const targetSpell: Ref<any> = ref(null)
export const draggedFromActiveFairySpells: Ref<boolean> = ref(false)
export const draggedUponFairy: Ref<any> = ref(null)

export default (draggableItems: Ref<(Fairy | Spell)[]>, listId: string) => {
  const onDragStartFairy = (event: any) => {
    isDragging.value = true
    draggedElement.value = event
  }

  const onDragOverFairy = (event: any) => {}

  const onEndFairy = (event: any) => {
    isDragging.value = false
    draggedElement.value = null
  }

  const onDropFairy = (event: any) => {
    if (!draggedElement.value) {
      return // No element is being dragged
    }

    if (event?.moved?.element) {
      // console.log('moved: ', event?.moved?.element)
    } else if (event?.added?.element && listId === 'fairies-list') {
      // Dropping from unused to active
      const dropIndex = event.added.newIndex
      const cutoutIndex = dropIndex >= 5 ? dropIndex - 1 : dropIndex + 1
      // console.log('cutoutIndex: ', cutoutIndex)
      const existingFairy = draggableItems.value[cutoutIndex]
      // console.log('existingFairy: ', existingFairy)

      if ($.player.fairiesList.value.length <= 5) {
        // If there's space, just add the new fairy
        // draggableFairies.value.splice(dropIndex, 0, draggedElement.value)
      } else {
        // If the list is full, replace the fairy at the drop index
        cutoutElement.value = draggableItems.value[cutoutIndex]
        if (existingFairy) {
          $.player.allFairiesList.value.push({ ...cutoutElement.value })
        }
        draggableItems.value = draggableItems.value.filter((e, index) => cutoutIndex !== index)
      }
    }

    if (listId === 'all-fairies-list') {
      $.player.allFairiesList.value = [...draggableItems.value]
    } else {
      $.player.fairiesList.value = [...draggableItems.value]
    }
  }

  return {
    draggedSpell,
    draggedFromActiveFairySpells,
    draggedElement,
    isDragging,
    onDragStartFairy,
    onDragOverFairy,
    onEndFairy,
    onDropFairy,
  }
}
