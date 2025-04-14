import FairyController from '@/entity/FairyController.ts'
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

  entity.getRotation = () => entity.mesh.quaternion
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
    /* DELETE ME: */
    if (routineName === 'trade') {
      WP.position = new Vector3(8.21, 0.1, 4.17)
    }

    entity.targetPosition.copy(WP.position.clone())
    /* reset current path to trigger new pathfinding */
    entity.path = []
    updateCallback = this.routines[this.routine].callback
  }

  const enemy: any = null
  entity.targetPosition = config.startPosition
  const performNPCLogic = () => {
    if ($?.level?.pathfinder) {
      if (entity.position.distanceTo(entity.targetPosition) > 0.5) {
        /*;(($.isDebug && entity.name === 'flf trader') || !$.isDebug) &&
         */ moveToTargetPosition(entity, entity.targetPosition, enemy, true)
      } else {
        updateCallback(entity)
      }
    }
  }

  let updateEventUuid = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    const isFinished = entity.update(deltaS, elapsedTimeInS)
    if (!isFinished) return

    if ($.isDialog.value) {
      entity.currentVelocity = new Vector3(0, 0, 0)
      entity.mesh.lookAt($.player.mesh.position.x, entity.position.y, $.player.mesh.position.z)
      return
    }

    performNPCLogic(deltaS)

    // Update movement based on AI decisions
    entity.currentVelocity = movementStrategy.calculateVelocity(entity.currentVelocity, deltaS)
  }

  entity.companion = FairyController({
    modelPath: '/models/yeti-young/yeti-young.fbx',
    stats: { name: `yeti young ${entity.name}` },
    startPosition: new Vector3(0, 0, 0),
    parent: entity,
    guild: 'guild-companion-fairy' as Guild,
    id: `yeti_young_${entity.uuid}`,
  })

  const loadedUuid = $.addEvent(`${entity.id}-loaded`, () => {
    updateEventUuid = $.addEvent('renderer.update', update)
    entity.setRoutine('start')
    // entity.mesh.lookAt(entity.targetPosition.x, entity.position.y, entity.targetPosition.z)
    entity.mesh.lookAt($.player.mesh.position.x, entity.position.y, $.player.mesh.position.z)
    $.removeEvent(`${entity.id}-loaded`, loadedUuid)
  })

  $.addEvent('level.cleanup', () => {
    $.removeEvent('renderer.update', loadedUuid)
  })

  $.entitiesMap.set(entity.uuid, entity)

  return entity
}

export default NPCController
