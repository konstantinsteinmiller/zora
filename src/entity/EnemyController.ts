import AssetLoader from '@/engine/AssetLoader.ts'
import { characterAnimationNamesList } from '@/enums/constants.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { controllerAwarenessUtils, controllerFunctions, controllerUtils, createOverHeadHealthBar, getBaseStats } from '@/utils/controller.ts'
import { moveToTargetPosition } from '@/utils/navigation.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, Vector3 } from 'three'

export default ({ modelPath, stats = {}, startPosition, modelHeight }: { modelPath: string; stats: any; startPosition: Vector3; modelHeight: number }) => {
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const halfHeight = modelHeight * 0.5

  const enemy = {
    ...new Object3D(),
    position: startPosition.clone(),
    ...getBaseStats(),
    ...stats,
    ...controllerUtils(),
    ...controllerFunctions(),
    ...controllerAwarenessUtils(),
    createOverHeadHealthBar,
    moveToTargetPosition,
    mesh,
    halfHeight,
  }

  let mixer: any = {}
  const animationsMap: any = {}

  const stateMachine = new CharacterFSM(animationsMap, enemy)
  enemy.stateMachine = stateMachine

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
        enemy.mesh = mesh
      },
    })
  }
  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity(startPosition, halfHeight, enemy.colliderRadius)
    enemy.rigidBody = rigidBody
    enemy.collider = collider
  }

  enemy.createOverHeadHealthBar(enemy)

  loadModels()
  initPhysics()

  const decceleration = new Vector3(-0.0005, -0.0001, -5.0)
  // const acceleration = new Vector3(1, 0.25, 15.0)
  const velocity = new Vector3(0, 0, 0)

  enemy.isAwaitingCoverCalculation = false
  const update = (deltaS: number) => {
    if (!enemy.mesh || enemy.stateMachine.currentState === null) {
      return
    }

    if (state?.level?.pathfinder) {
      const targetPosition = null // use a random point in the map
      const isEnemyAThreat: boolean = enemy.detectEnemyThreat(enemy, state.player)
      const isEntityChargeCritical: boolean = enemy.detectCriticalCharge(enemy)

      if (isEnemyAThreat && !enemy.isAwaitingCoverCalculation) {
        enemy.isAwaitingCoverCalculation = true
        enemy.findCoverPosition(enemy, state.player).then((coverPosition: Vector3) => {
          // coverPosition calculation returned from web worker
          if (isEntityChargeCritical) {
            isEntityChargeCritical && console.log('isEntityChargeCritical: ', isEntityChargeCritical)
            enemy.path = null
            enemy.moveToTargetPosition(enemy, state.player.mesh.position, state.player, true)
            return
          }

          if (isEnemyAThreat) {
            console.log('goto coverPosition: ')
            enemy.path = null
            enemy.lastCoverPosition = coverPosition
            // enemy.moveToTargetPosition(enemy, coverPosition, state.player)

            /* go directly to cover position */
            enemy.moveToTargetPosition(enemy, coverPosition, state.player, true)
          } else {
            enemy.lastCoverPosition = null
            enemy.isAwaitingCoverCalculation = false
          }
        })
      } else if (!enemy.lastCoverPosition) {
        /* move around randomly */
        enemy.moveToTargetPosition(enemy, targetPosition, state.player)
      }
    }

    const frameDecceleration = new Vector3(velocity.x * decceleration.x, velocity.y * decceleration.y, velocity.z * decceleration.z)
    frameDecceleration.multiplyScalar(deltaS)
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const movementVector = calcRapierMovementVector(enemy, velocity, deltaS)
    enemy.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -enemy.halfHeight, 0).add(enemy.rigidBody.translation())
    // Update Three.js Mesh Position
    enemy.position.copy(meshPos)
    mesh.position.copy(meshPos)

    mixer?.update?.(deltaS)
  }

  /* @Todo: remove the eventUuid when the enemy is destroyed */
  const eventUuid = state.addEvent('renderer.update', update)

  state.enemy = enemy
  return enemy
}
