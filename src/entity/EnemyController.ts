import AssetLoader from '@/engine/AssetLoader.ts'
import { createEnemyMovementStrategy } from '@/entity/MovementStrategy.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import {
  chargeUtils,
  controllerAwarenessUtils,
  statsUtils,
  controllerUtils,
  createOverHeadHealthBar,
  getBaseStats,
} from '@/utils/controller.ts'
import { moveToTargetPosition } from '@/utils/navigation.ts'
import { createEntityColliderBox, createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, type Quaternion, Vector3 } from 'three'

export default ({
  enemy,
  modelPath,
  name,
  startPosition,
  startRotation,
  modelHeight,
}: {
  enemy: any
  modelPath: string
  name: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
}) => {
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const halfHeight = modelHeight * 0.5
  const entity = {
    ...new Object3D(),
    position: startPosition.clone(),
    ...getBaseStats(),
    ...controllerUtils(),
    ...statsUtils(),
    ...controllerAwarenessUtils(),
    ...chargeUtils(),
    mesh,
    halfHeight,
    name,
  }

  entity.currentSpell.speed = 6
  entity.currentSpell.damage = state.isDebug ? 140 : 40

  let mixer: any = {}
  const animationsMap: any = {}

  const stateMachine = new CharacterFSM(animationsMap, entity)
  entity.stateMachine = stateMachine
  const movementStrategy = createEnemyMovementStrategy()
  entity.currentVelocity = new Vector3(0, 0, 0)

  const loadModels = async () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    await loadCharacterModelWithAnimations({
      modelPath,
      parent: state.scene,
      position: startPosition,
      scale: 0.01,
      stateMachine,
      animationsMap,
      animationNamesList: characterAnimationNamesList,
      callback: (scope: any) => {
        mixer = scope.mixer
        mesh = scope.mesh
        mesh.entityId = `${entity.uuid}`
        entity.mesh = mesh

        entity.center = entity.calcHalfHeightPosition(entity)
        createEntityColliderBox(entity)
      },
    })
  }
  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity({ position: startPosition, entity })
    entity.rigidBody = rigidBody
    entity.collider = collider
    entity.rigidBody.setRotation(startRotation)
  }

  createOverHeadHealthBar(entity)

  loadModels()
  initPhysics()

  entity.isAwaitingCoverCalculation = false
  const performAgentLogic = () => {
    if (state?.level?.pathfinder) {
      const { isEnemyAThreat /*, canSeeEnemy*/ } = entity.detectEnemyThreat(entity, enemy)
      const isEntityChargeCritical: boolean = entity.detectCriticalCharge(entity)

      // if (isEntityChargeCritical && canSeeEnemy) {
      //   console.log('canSeeEnemy: ', canSeeEnemy)
      // }

      if (entity.currentSpell.charge === 0) {
        entity.chargeAttack(entity, enemy)
      }

      if (isEnemyAThreat && !entity.isAwaitingCoverCalculation) {
        // console.log('%c threat detected: ', 'color: darkred', entity.isAwaitingCoverCalculation)
        entity.isAwaitingCoverCalculation = true
        entity.findCoverPosition(entity, enemy).then((coverPosition: Vector3) => {
          // coverPosition calculation returned from web worker
          if (isEntityChargeCritical) {
            isEntityChargeCritical &&
              console.log('%c isEntityChargeCritical: ', 'background: black; color: white;', isEntityChargeCritical)
            entity.path = null
            moveToTargetPosition(entity, enemy.mesh.position, enemy, true)
            return
          }

          if (isEnemyAThreat) {
            // console.log('goto coverPosition: ')
            entity.path = null
            entity.lastCoverPosition = coverPosition
            /* go directly to cover position */
            moveToTargetPosition(entity, coverPosition, enemy, true)
          } else {
            entity.lastCoverPosition = null
            entity.isAwaitingCoverCalculation = false
          }
        })
      } else if (!entity.lastCoverPosition) {
        /* move around randomly */
        const targetPosition = null // use a random point in the map
        moveToTargetPosition(entity, targetPosition, enemy)
      }
    }
  }

  const updatePosition = (deltaS: number) => {
    const movementVector = calcRapierMovementVector(entity, entity.currentVelocity, deltaS)
    entity.rigidBody.setNextKinematicRotation(entity.getRotation())
    entity.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -halfHeight, 0).add(entity.rigidBody.translation())
    // Update Three.js Mesh Position
    entity.position.copy(meshPos)
    mesh.position.copy(meshPos)
    entity.center = entity.calcHalfHeightPosition(entity)
  }

  const checkIsCharacterDead = () => {
    if (entity.isDead(entity)) {
      entity.die(entity)
      state.isBattleOver = true
      return
    }
  }

  let updateEventUuid: string = ''
  const update = (deltaS: number) => {
    if (!entity.mesh || entity.stateMachine.currentState === null) {
      return
    }
    checkIsCharacterDead()

    entity.checkBattleOver(updateEventUuid)

    performAgentLogic()

    entity.currentVelocity = movementStrategy.calculateVelocity(entity.currentVelocity, deltaS)

    updatePosition(deltaS)

    mixer?.update?.(deltaS)
  }

  entity.start = () => {
    updateEventUuid = state.addEvent('renderer.update', update)
  }

  entity.checkBattleOver = (updateEventUuid: string) => {
    if (state.isBattleOver) {
      state.removeEvent('renderer.update', updateEventUuid)
    }
  }

  state.entitiesMap.set(entity.mesh.entityUuid, entity)
  state.enemy = entity
  return entity
}
