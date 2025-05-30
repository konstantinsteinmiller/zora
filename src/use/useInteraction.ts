import { cleanupLevel } from '@/Game.ts'
import router from '@/router'
import { ICE_YETI_YOUNG } from '@/Story/Fairies/ice-fairies.ts'
import { savePlayer } from '@/use/useWorldState.ts'
import { animateArc } from '@/utils/animation.ts'
import { INTERACTIONS } from '@/utils/enums.ts'
import { spawnWildFairy } from '@/utils/world.ts'
import { type Ref, ref } from 'vue'
import type { Entity } from '@/types/entity'
import { Vector3 } from 'three'
import $ from '@/global'

const isInteractionVisible = ref(false)
const interactionId = ref('')
const currentBillboardEntity = ref<Entity | null>(null)
const spawnPointActivatedMap: Ref<Map<string, boolean>> = ref<Map<string, boolean>>(new Map())

$.addEvent('level.cleanup', () => {
  spawnPointActivatedMap.value.clear()
  interactionId.value = ''
  isInteractionVisible.value = false
  currentBillboardEntity.value = null
  $.targetToFocus.value = null
  $.dialogSelf.value = null
  $.isDispel.value = false
  $.isDispel.value = false
  $.isDialog.value = false
})

const showInteraction = (entity: Entity, domId: string) => {
  interactionId.value = domId
  $.targetToFocus.value = entity.closestInteractableEntity
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

let startTime = 0
const wildFairy: Ref<any> = ref(null)
const showDispel = (closestFairySpawnPoint: string) => {
  wildFairy.value = spawnWildFairy(ICE_YETI_YOUNG.id, closestFairySpawnPoint)
  if (wildFairy.value?.position) {
    $.isBattleStarting.value = true

    spawnPointActivatedMap.value.set(closestFairySpawnPoint, true)
    $.targetToFocus.value = wildFairy.value
    $.isDispel.value = true
    isInteractionVisible.value = true

    startTime = performance.now()
    const animationDuration = 2.5 // seconds
    const updateUuid = $.addEvent('renderer.update', () => {
      const currentTime = performance.now()
      const elapsedTime = (currentTime - startTime) / 1000
      const progress = Math.min(1, elapsedTime / animationDuration)
      if (progress < 1) {
        animateArc(progress, wildFairy)
      } else {
        setTimeout(() => {
          /* is fairy already dispelled? */
          if (!wildFairy.value.mesh) return

          /* make your fairy animation towards spawn point and reverse
           * wild fairy arc */

          $.targetToFocus.value?.dispel?.()
          hideDispel()
          $.isBattleStarting.value = false
          savePlayer()

          cleanupLevel(false, true)
          setTimeout(() => {
            router.push({ name: 'battle', params: { worldId: 'water-arena' }, query: $.route.value.query })
          }, 300)
        }, 1000) // Keep visible for a bit after animation

        $.removeEvent('renderer.update', updateUuid)
      }
    })
  } else {
    hideDispel()
  }
}

const hideDispel = () => {
  if ($.isDispel.value) {
    isInteractionVisible.value = false
    $.targetToFocus.value = null
    $.isDispel.value = false
    $.controls.setPointerLock()
  }
}

export default function useInteraction() {
  return {
    isInteractionVisible,
    interactionId,
    showInteraction,
    hideInteraction,
    showDispel,
    hideDispel,
    spawnPointActivatedMap,
  }
}
