import { createEnemyMovementStrategy } from '@/entity/MovementStrategy.ts'
import WorldController from '@/entity/WorldController.ts'
import $ from '@/global'
import type { Guild } from '@/types/entity.ts'
import { worldNPCAnimationNamesList } from '@/utils/constants.ts'
import { moveToTargetPosition } from '@/utils/navigation.ts'
import { type Quaternion, Vector3 } from 'three'

interface NPCControllerProps {
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
}

const NPCController = (config: NPCControllerProps) => {
  const entity = WorldController({ ...config, animationNamesList: worldNPCAnimationNamesList })

  const utils: any = {}
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
  entity.targetPosition = new Vector3(0, 0, 0)

  entity.routines = {}
  const movementStrategy = createEnemyMovementStrategy()

  // createOverHeadNameLabel(entity) // only on character focus
  let updateCallback: (entity: any) => void = () => {}
  entity.setRoutine = function (routineName: string) {
    if (routineName === this.routine) return
    if (!routineName) {
      console.warn(`pls define an existing routine for ${entity.id}: `, Object.entries(this.routines))
      return
    }
    this.routine = routineName

    /* get targetPosition from WP */
    const WP = $.level?.WPsMap?.get(this.routines[this.routine].wp)
    if (!WP) {
      console.error(`Waypoint for ${this.routines[this.routine]} not found`)
      return
    }

    entity.targetPosition.copy(WP.position.clone())
    updateCallback = this.routines[this.routine].callback
  }

  const enemy: any = null
  entity.targetPosition = config.startPosition
  const performNPCLogic = () => {
    if ($?.level?.pathfinder) {
      // console.log(
      //   'entity.position.distanceTo(entity.targetPosition): ',
      //   entity.targetPosition,
      //   entity.position.distanceTo(entity.targetPosition)
      // )
      if (entity.position.distanceTo(entity.targetPosition) > 0.5) {
        moveToTargetPosition(entity, entity.targetPosition, enemy, true)
      } else {
        updateCallback(entity)
      }
    }
    // console.log('entity.routine: ', entity.routine)
    // console.log('targetPosition: ', targetPosition)
  }

  let updateEventUuid = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    const isFinished = entity.update(deltaS, elapsedTimeInS)
    if (!isFinished) return

    performNPCLogic(deltaS)

    // Update movement based on AI decisions
    entity.currentVelocity = movementStrategy.calculateVelocity(entity.currentVelocity, deltaS)
  }

  entity.start = () => {
    updateEventUuid = $.addEvent('renderer.update', update)
    entity.setRoutine('start')
    // entity.mesh.lookAt(entity.targetPosition.x, entity.position.y, entity.targetPosition.z)
    entity.mesh.lookAt($.trainer.mesh.position.x, entity.position.y, $.trainer.mesh.position.z)
  }

  $.entitiesMap.set(entity.uuid, entity)

  return entity
}

export default NPCController
