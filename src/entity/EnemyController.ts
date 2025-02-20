import AssetLoader from '@/engine/AssetLoader.ts'
import { baseStats, characterAnimationNamesList } from '@/enums/constants.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState.ts'
import { calcRapierMovementVector } from '@/utils/collision.ts'
import { controllerFunctions, controllerUtils } from '@/utils/controller.ts'
import { moveToRandomPosition } from '@/utils/navigation.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, Vector3 } from 'three'

export default ({ modelPath, stats = {}, startPosition, modelHeight }: { modelPath: string; stats: any; startPosition: Vector3; modelHeight: number }) => {
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const halfHeight = modelHeight * 0.5

  const enemy = {
    ...new Object3D(),
    position: startPosition.clone(),
    ...baseStats,
    ...stats,
    ...controllerUtils(),
    ...controllerFunctions(),
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
    const { rigidBody, collider } = createRigidBodyEntity(startPosition, halfHeight)
    enemy.rigidBody = rigidBody
    enemy.collider = collider
  }

  enemy.createHealthBar = () => {
    const healthbarContainer = document.querySelector('.enemy-life-bar') as HTMLDivElement

    const updateHealthBar = () => {
      if (!healthbarContainer || !mesh) return
      const enemyPosition = mesh.position.clone() // Placeholder for enemy position
      mesh.getWorldPosition(enemyPosition)
      enemyPosition.y += 1.9 // Adjust height to be above the enemy

      // Convert 3D position to 2D screen space
      const screenPosition = enemyPosition.clone().project(state.camera)
      const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth
      const y = (1 - (screenPosition.y * 0.5 + 0.5)) * window.innerHeight

      // Calculate distance from camera
      const distance = state.camera.position.distanceTo(enemyPosition)

      // Scale health bar size based on distance (closer = bigger, farther = smaller)
      const scaleFactor = Math.max(0.3, Math.min(1.0, 5 / distance)) // Clamps scale between 0.5 and 1.5

      healthbarContainer.style.transform = `translate(-50%, -100%) scale(${scaleFactor})`
      healthbarContainer.style.left = `${x}px`
      healthbarContainer.style.top = `${y}px`
      healthbarContainer.dataset.width = '100'

      if (screenPosition.z < 0 || screenPosition.z > 1) {
        healthbarContainer.style.opacity = '0'
      } else {
        healthbarContainer.style.opacity = '1'
      }
    }
    state.addEvent('renderer.update', () => updateHealthBar())
  }
  enemy.createHealthBar()

  enemy.moveToRandomPosition = moveToRandomPosition

  loadModels()
  initPhysics()

  const decceleration = new Vector3(-0.0005, -0.0001, -5.0)
  // const acceleration = new Vector3(1, 0.25, 15.0)
  const velocity = new Vector3(0, 0, 0)

  const update = (deltaS: number, elapsedTimeInS: number) => {
    if (!enemy.mesh || enemy.stateMachine.currentState === null) {
      return
    }

    if (state?.level?.pathfinder) {
      enemy.moveToRandomPosition(enemy, state.player)
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

  const eventUuid = state.addEvent('renderer.update', update)

  state.enemy = enemy
  return enemy
}
