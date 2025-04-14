import FairyController from '@/entity/FairyController.ts'
import WorldController from '@/entity/WorldController.ts'
import type { Guild } from '@/types/entity.ts'
import useDialog from '@/use/useDialog.ts'
import useInteraction from '@/use/useInteraction.ts'
import useInventory from '@/use/useInventory.ts'
import useOctree from '@/use/useOctree.ts'
import { INTERACTIONS } from '@/utils/enums.ts'
import { Quaternion, Vector3 } from 'three'
import InputController from '@/control/KeyboardController.ts'
import { createPlayerMovementStrategy } from '@/entity/MovementStrategy.ts'
import $ from '@/global'

interface PlayerControllerProps {
  modelPath: string
  stats?: any
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  guild: Guild
  id: string
}

const PlayerController = (config: PlayerControllerProps) => {
  let entity = WorldController(config)
  const utils: any = {
    /*...chargeUtils()*/
  }
  for (const key in utils) {
    entity[key] = utils[key]
  }

  entity.getPosition = () => {
    if (!entity.mesh) {
      return new Vector3(0, 0, 0)
    }
    return entity.mesh?.position
  }
  entity.getRotation = () => {
    return entity.mesh.quaternion
  }
  entity.setRotation = (rotation: Quaternion) => {
    if (!entity.mesh) {
      return
    }
    const prevQuat = entity.mesh.quaternion.clone()
    prevQuat.slerp(rotation, 0.2) // Smooth interpolation
    entity.rigidBody.setRotation(prevQuat)
    return entity.mesh.quaternion.copy(prevQuat)
  }

  const movementStrategy = createPlayerMovementStrategy()

  InputController(entity)

  // const interactWith = (closeEntities: any) => {
  //   console.log('interactWith NPC: ', closeEntities[0])
  // }
  const { inventoryMap } = useInventory()
  entity.inventory = { inventoryMap }

  const { showInteraction, hideInteraction } = useInteraction()
  const { setKnown, knows } = useDialog()
  const { getClosestEntity } = useOctree()
  let interactionThrottleCounter = 0
  const interactionDistance = 5

  const findNpcInteraction = () => {
    interactionThrottleCounter++
    if (interactionThrottleCounter % 5 !== 0) return
    const closestEntity = getClosestEntity(entity, interactionDistance, ['companion-fairy'])
    // closestEntity = closestEntity?.guild === 'guild-wild-fairy' ? closestEntity?.parentController : closestEntity
    // guild-player-fairy
    if (closestEntity && !$.isMenu.value && !$.isDialog.value) {
      entity.closestInteractableEntity = closestEntity

      showInteraction(entity, INTERACTIONS.TALK)

      if (closestEntity?.id === $.dialogSelf.value?.id && !$.isDialog.value && $.importantDialog.value?.length) {
        $.isDialog.value = true
        const dialog = $.importantDialog.value?.[0]
        if (!knows(dialog?.id)) {
          dialog?.on?.()
          setKnown(dialog?.id)
        }
      }
    } else {
      entity.closestInteractableEntity = null
      hideInteraction()
    }
  }
  entity.closestInteractable = null

  let updateEventUuid: string = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    const isFinished = entity.update(deltaS, elapsedTimeInS)
    if (!isFinished || !entity.mesh) return

    entity.stateMachine.update(deltaS, $.controls)

    findNpcInteraction()

    entity.currentVelocity = movementStrategy.calculateVelocity(entity, deltaS, $.controls)
  }
  updateEventUuid = $.addEvent('renderer.update', update)

  entity.companion = FairyController({
    modelPath: '/models/nature-fairy-1/nature-fairy-1.fbx',
    stats: { name: 'nature fairy' },
    parent: entity,
    startPosition: new Vector3(0, 0, 0),
    guild: 'guild-companion-fairy' as Guild,
    id: 'nature_fairy',
  })

  $.addEvent('level.cleanup', () => {
    $.removeEvent('renderer.update', updateEventUuid)
    entity = null
    $.player = null
    $.entitiesMap.clear()
  })

  $.entitiesMap.set(entity.uuid, entity)
  $.player = entity
  $.trainer = entity

  return entity
}

export default PlayerController
