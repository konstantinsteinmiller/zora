import AssetLoader from '@/engine/AssetLoader.ts'
import camera from '@/engine/Camera.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState.ts'
import { controllerFunctions, controllerUtils } from '@/utils/controller.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import Rapier, { Capsule, QueryFilterFlags, Ray } from '@dimforge/rapier3d-compat'
import { Camera, Object3D, Vector3 } from 'three'
import { lerp } from 'three/src/math/MathUtils'

const baseStats: any = {
  hp: 100,
  previousHp: 100,
  maxHp: 100,
  mp: 100,
  previousMp: 100,
  maxMp: 100,
  endurance: 100,
  previousEndurance: 100,
  maxEndurance: 100,
  currentSpell: {
    name: 'shot',
    speed: 1,
    damage: 25,
  },
  isGrounded: false,
}

export default ({ modelPath, stats, startPosition, modelHeight }: { modelPath: string; stats: any; startPosition: Vector3; modelHeight: number }) => {
  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const enemy = {
    ...new Object3D(),
    position: startPosition.clone(),
    ...(stats ? stats : baseStats),
    ...controllerUtils(),
    ...controllerFunctions,
    mesh,
  }

  const halfHeight = modelHeight * 0.5

  let mixer: any = {}
  const animationsMap: any = {}

  const stateMachine = new CharacterFSM(animationsMap)
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
      animationNamesList: ['walk', 'run', 'idle', 'dance', 'cast', 'jump'],
      callback: (scope: any) => {
        mixer = scope.mixer
        mesh = scope.mesh
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

  loadModels()
  initPhysics()

  const decceleration = new Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new Vector3(1, 0.25, 15.0)
  const velocity = new Vector3(0, 0, 0)

  const update = (timeInSeconds: number, elapsedTimeInS: number) => {
    if (!enemy.mesh || enemy.stateMachine.currentState === null) {
      return
    }

    const frameDecceleration = new Vector3(velocity.x * decceleration.x, velocity.y * decceleration.y, velocity.z * decceleration.z)
    frameDecceleration.multiplyScalar(timeInSeconds)
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const meshQuat: any = mesh.quaternion
    const forward = new Vector3(0, 0, 1)
      .applyQuaternion(meshQuat)
      .normalize()
      .multiplyScalar(velocity.z * timeInSeconds)
    const sideways = new Vector3(1, 0, 0)
      .applyQuaternion(meshQuat)
      .normalize()
      .multiplyScalar(velocity.x * timeInSeconds)

    mesh.position.add(forward)
    mesh.position.add(sideways)

    if (!enemy.rigidBody) return

    const movementVector = new Rapier.Vector3(forward.x + sideways.x, forward.y + sideways.y, forward.z + sideways.z)
    const rigidPos = enemy.rigidBody.translation()
    movementVector.x += rigidPos.x
    movementVector.y += rigidPos.y
    movementVector.z += rigidPos.z

    /* implement ray cast down to detect ground and only apply
     * gravity when not grounded */
    const physicsRayDown = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 })
    movementVector.y += -4 * timeInSeconds

    physicsRayDown.origin = rigidPos
    let hit = state.physics.castRay(physicsRayDown, halfHeight, false, 0xff0000ff)
    if (hit) {
      /* isGrounded determines if player can jump or start flying */
      enemy.isGrounded = true
      movementVector.y = rigidPos.y
      const point = physicsRayDown.pointAt(hit.timeOfImpact)
      let diff = +(rigidPos.y - (point.y + halfHeight)).toFixed(3)
      // console.log('point: ', diff)
      if (diff < -0.05 && diff > -0.3) {
        if (diff > 0) {
          diff = 0
        }
        movementVector.y = rigidPos.y - diff
      }
    }

    /* shape cast into movementVector direction to find obstacles */
    const shapePos = { x: movementVector.x, y: movementVector.y + halfHeight - 0.1, z: movementVector.z }
    const shapeRot = enemy.rigidBody.rotation()
    const shapeVel = movementVector
    const shape = new Capsule(0.7, 0.4)
    const targetDistance = 0.0
    const maxToi = 0.1
    // Optional parameters:
    const stopAtPenetration = true
    const filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC
    const filterGroups = 0x000b0001
    const filterExcludeCollider = enemy.collider
    const filterExcludeRigidBody = enemy.rigidBody

    hit = state.physics.castShape(shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
    if (hit != null) {
      const normal = new Vector3(hit.normal1.x, hit.normal1.y, hit.normal1.z).normalize()

      // Project movement onto the surface to allow sliding
      const movementDir = new Vector3(movementVector.x - rigidPos.x, 0, movementVector.z - rigidPos.z)
      const dotProduct = movementDir.dot(normal)

      // Remove the component of movement that goes into the wall
      movementDir.sub(normal.multiplyScalar(dotProduct))
      if (dotProduct < 0) {
        // Apply the adjusted movement vector
        movementVector.x = rigidPos.x + movementDir.x
        movementVector.z = rigidPos.z + movementDir.z
      }

      // if (previousPos.x === playerPos.x && previousPos.z === playerPos.z) {
      //   console.log('player is stuck: ')
      // }
      // console.log('Hit the collider', hit.collider, 'at time', hit.time_of_impact)
    }
    enemy.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -halfHeight, 0).add(enemy.rigidBody.translation())
    // Update Three.js Mesh Position
    enemy.position.copy(meshPos)
    mesh.position.copy(meshPos)

    mixer?.update?.(timeInSeconds)
  }

  const eventUuid = state.addEvent('renderer.update', update)

  state.enemy = enemy
  return enemy
}
