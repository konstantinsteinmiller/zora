import type { Guild } from '@/types/entity.ts'
import { aiChargeUtils, chargeUtils, controllerAwarenessUtils } from '@/utils/controller.ts'
import { Quaternion, Vector3 } from 'three'
import Controller from '@/entity/Controller.ts'
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
}

const PlayerController = (config: PlayerControllerProps) => {
  let entity = Controller(config)
  const utils: any = { ...chargeUtils() }
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

  let updateEventUuid = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    const isFinished = entity.update(deltaS, elapsedTimeInS)
    if (!isFinished) return

    entity.stateMachine.update(deltaS, $.controls)

    entity.checkBattleOver(updateEventUuid)

    entity.currentVelocity = movementStrategy.calculateVelocity(entity, deltaS, $.controls)

    entity.regenEndurance(entity, deltaS)
    // entity.updateLife(entity, elapsedTimeInS)
  }

  entity.start = () => {
    updateEventUuid = $.addEvent('renderer.update', update)
  }

  $.addEvent('arena.cleanup', () => {
    entity = null
    $.player = null
  })

  $.entitiesMap.set(entity.uuid, entity)
  $.player = entity

  return entity
}

export default PlayerController
