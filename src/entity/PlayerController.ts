import type { Guild } from '@/types/entity.ts'
import { chargeUtils } from '@/utils/controller.ts'
import { Quaternion, Vector3 } from 'three'
import Controller from '@/entity/Controller.ts'
import InputController from '@/control/KeyboardController.ts'
import { createPlayerMovementStrategy } from '@/entity/MovementStrategy.ts'
import state from '@/states/GlobalState.ts'

interface PlayerControllerProps {
  modelPath: string
  stats?: any
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  guild: Guild
}

const PlayerController = (config: PlayerControllerProps) => {
  const chargeUtilsObj = chargeUtils()

  let entity = Controller(config)
  entity.updateChargeIndicator = chargeUtilsObj.updateChargeIndicator
  entity.createChargeIndicator = chargeUtilsObj.createChargeIndicator
  entity.destroyChargeIndicatorVFX = chargeUtilsObj.destroyChargeIndicatorVFX

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

    entity.stateMachine.update(deltaS, state.controls)

    entity.checkBattleOver(updateEventUuid)

    entity.currentVelocity = movementStrategy.calculateVelocity(entity, deltaS, state.controls)

    entity.regenEndurance(entity, deltaS)
    // entity.updateLife(entity, elapsedTimeInS)
  }

  entity.start = () => {
    updateEventUuid = state.addEvent('renderer.update', update)
  }

  state.addEvent('arena.cleanup', () => {
    entity = null
    state.player = null
  })

  state.entitiesMap.set(entity.uuid, entity)
  state.player = entity

  return entity
}

export default PlayerController
