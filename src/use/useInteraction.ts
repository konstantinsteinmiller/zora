import { INTERACTIONS } from '@/utils/enums.ts'
import { ref } from 'vue'
import type { Entity } from '@/types/entity'
import { Vector3 } from 'three'
import $ from '@/global'

const isInteractionVisible = ref(false)
const interactionId = ref('')
const currentBillboardEntity = ref<Entity | null>(null)

const showInteraction = (entity: Entity, domId: string) => {
  interactionId.value = domId
  $.dialogSelf.value = entity.closestInteractableEntity
  if (entity.closestInteractableEntity && entity.closestInteractableEntity.mesh) {
    currentBillboardEntity.value = entity
    isInteractionVisible.value = true
    updateBillboardPosition(entity.closestInteractableEntity)
  } else {
    hideInteraction()
  }
}

const hideInteraction = () => {
  isInteractionVisible.value = false
  currentBillboardEntity.value = null
  const billboard = document.getElementById(interactionId.value)
  if (billboard) {
    interactionId.value = ''
    billboard.style.display = 'none'
  }

  const nameBillboard = document.getElementById(INTERACTIONS.NAME)
  if (nameBillboard) {
    interactionId.value = ''
    nameBillboard.style.display = 'none'
  }
}

const updateNameBillboardPosition = (entity: Entity) => {
  const billboard = document.getElementById(INTERACTIONS.NAME)
  if (billboard && entity?.mesh) {
    const entityPosition = entity.mesh.position
    const billboardOffsetWorld = new Vector3(0, entity.halfHeight * 2 + 0.2, 0) // Offset to the top

    // Get the camera's right vector in world space
    const cameraRightWorld = new Vector3()
    $.camera?.getWorldDirection(cameraRightWorld)
    cameraRightWorld.cross($.camera?.up || new Vector3(0, 1, 0)).normalize()

    // Calculate the billboard's world position based on the entity's position and the camera's right vector
    const billboardWorldPosition = new Vector3()
      .copy(entityPosition)
      .add(cameraRightWorld.multiplyScalar(billboardOffsetWorld.x))
      .add(new Vector3(0, billboardOffsetWorld.y, 0))
      .add(new Vector3(0, 0, billboardOffsetWorld.z))

    const camera = $.camera
    if (camera) {
      const screenPosition = billboardWorldPosition.clone()
      screenPosition.project(camera)

      const canvas = $.renderer.domElement
      const canvasWidth = canvas.clientWidth
      const canvasHeight = canvas.clientHeight

      const elementX = ((screenPosition.x + 1) * canvasWidth) / 2
      const elementY = ((1 - screenPosition.y) * canvasHeight) / 2

      billboard.style.left = `${elementX}px`
      billboard.style.top = `${elementY}px`
      billboard.style.display = 'block'
    } else {
      console.warn('Camera not available to position billboard.')
      billboard.style.display = 'none'
    }
  } else if (billboard) {
    billboard.style.display = 'none'
  }
}

const updateBillboardPosition = (entity: Entity) => {
  const billboard = document.getElementById(interactionId.value)
  if (billboard && entity?.mesh) {
    const entityPosition = entity.mesh.position
    const billboardOffsetWorld = new Vector3(entity.halfHeight * 1.2, entity.halfHeight + 0.75, 0) // Offset to the right

    // Get the camera's right vector in world space
    const cameraRightWorld = new Vector3()
    $.camera?.getWorldDirection(cameraRightWorld)
    cameraRightWorld.cross($.camera?.up || new Vector3(0, 1, 0)).normalize()

    // Calculate the billboard's world position based on the entity's position and the camera's right vector
    const billboardWorldPosition = new Vector3()
      .copy(entityPosition)
      .add(cameraRightWorld.multiplyScalar(billboardOffsetWorld.x))
      .add(new Vector3(0, billboardOffsetWorld.y, 0))
      .add(new Vector3(0, 0, billboardOffsetWorld.z))

    const camera = $.camera
    if (camera) {
      const screenPosition = billboardWorldPosition.clone()
      screenPosition.project(camera)

      const canvas = $.renderer.domElement
      const canvasWidth = canvas.clientWidth
      const canvasHeight = canvas.clientHeight

      const elementX = ((screenPosition.x + 1) * canvasWidth) / 2
      const elementY = ((1 - screenPosition.y) * canvasHeight) / 2

      billboard.style.left = `${elementX}px`
      billboard.style.top = `${elementY}px`
      billboard.style.display = 'block'
    } else {
      console.warn('Camera not available to position billboard.')
      billboard.style.display = 'none'
    }
  } else if (billboard) {
    billboard.style.display = 'none'
  }
}

const updateUuid = $.addEvent('renderer.update', () => {
  if (isInteractionVisible.value && currentBillboardEntity.value?.closestInteractableEntity) {
    updateBillboardPosition(currentBillboardEntity.value.closestInteractableEntity)
    updateNameBillboardPosition(currentBillboardEntity.value.closestInteractableEntity)
  }
})

const cleanupUuid = $.addEvent('level.cleanup', () => {
  $.removeEvent('renderer.update', updateUuid)
  $.removeEvent('level.cleanup', cleanupUuid)
  hideInteraction()
})

export default function useInteraction() {
  return {
    isInteractionVisible,
    interactionId,
    showInteraction,
    hideInteraction,
  }
}
