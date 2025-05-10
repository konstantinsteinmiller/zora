import FairyController from '@/entity/FairyController.ts'
import WorldController from '@/entity/WorldController.ts'
import { METAL_SCORPION_OLD } from '@/Story/Fairies/metal-fairies.ts'
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
import { ref } from 'vue'

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
    ...($?.world?.playerRef.value
      ? {
          currency: $.world.playerRef.value.currency,
          inventory: $.world.playerRef.value.inventory,
          fairiesList: ref($.world.playerRef.value.fairiesList),
          spells: { spellsList: ref($.world.playerRef.value.spells.spellsList) },
        }
      : {}),
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

  const { inventoryMap } = useInventory()
  entity.inventory = { inventoryMap }

  const { showInteraction, hideInteraction, showDispel, spawnPointActivatedMap } = useInteraction()
  const { setKnown, knows } = useDialog()
  const { getClosestEntity, getClosestFairySpawn } = useOctree()
  let interactionThrottleCounter = 0
  let dispelThrottleCounter = 0
  const interactionDistance = 5

  const findNpcInteraction = () => {
    interactionThrottleCounter++
    if (interactionThrottleCounter % 5 !== 0) return
    const closestEntity = getClosestEntity(entity, interactionDistance, ['companion-fairy', 'wild-fairy'])

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

  const findWildFairyInteraction = () => {
    dispelThrottleCounter++
    if (dispelThrottleCounter % 2 !== 0) return

    const closestFairySpawnPoint: string | null = getClosestFairySpawn(entity, 7)

    if (
      !$.isBattleStarting?.value &&
      closestFairySpawnPoint &&
      !$.isMenu.value &&
      !spawnPointActivatedMap.value.get(closestFairySpawnPoint)
    ) {
      showDispel(closestFairySpawnPoint)
    }
  }

  let updateEventUuid: string = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    const isFinished = entity.update(deltaS, elapsedTimeInS)
    if (!isFinished || !entity.mesh) return

    entity.stateMachine.update(deltaS, $.controls)

    findNpcInteraction()

    !$.isMenu.value && findWildFairyInteraction()

    entity.currentVelocity = movementStrategy.calculateVelocity(entity, deltaS, $.controls)
  }
  updateEventUuid = $.addEvent('renderer.update', update)

  entity.companion = FairyController({
    modelPath: METAL_SCORPION_OLD.modelPath,
    stats: { name: METAL_SCORPION_OLD.name },
    parent: entity,
    startPosition: new Vector3(0, 0, 0),
    guild: 'guild-companion-fairy' as Guild,
    id: 'fire_harpy',
  })

  $.addEvent('level.cleanup', () => {
    $.removeEvent('renderer.update', updateEventUuid)
    entity = null
    $.player = null
    console.log('clean player ', $.player)
    $.entitiesMap.clear()
  })

  $.entitiesMap.set(entity.uuid, entity)
  $.player = entity

  return entity
}

export default PlayerController
