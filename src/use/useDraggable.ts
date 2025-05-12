import $ from '@/global.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ref, type Ref } from 'vue'

export const draggedElement: Ref<any> = ref(null)
export const cutoutElement: Ref<any> = ref(null)
export const isDragging: Ref<boolean> = ref(false)

export default (draggableFairies: Ref<Fairy[]>, listId: string) => {
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
      const existingFairy = draggableFairies.value[cutoutIndex]
      // console.log('existingFairy: ', existingFairy)

      if ($.player.fairiesList.value.length <= 5) {
        // If there's space, just add the new fairy
        // draggableFairies.value.splice(dropIndex, 0, draggedElement.value)
      } else {
        // If the list is full, replace the fairy at the drop index
        cutoutElement.value = draggableFairies.value[cutoutIndex]
        if (existingFairy) {
          $.player.allFairiesList.value.push({ ...cutoutElement.value })
        }
        draggableFairies.value = draggableFairies.value.filter((e, index) => cutoutIndex !== index)
      }
    }

    if (listId === 'all-fairies-list') {
      $.player.allFairiesList.value = [...draggableFairies.value]
    } else {
      $.player.fairiesList.value = [...draggableFairies.value]
    }
  }

  return {
    draggedElement,
    isDragging,
    onDragStartFairy,
    onDragOverFairy,
    onEndFairy,
    onDropFairy,
  }
}
