import AssetLoader from '@/engine/AssetLoader.ts'
import camera from '@/engine/Camera.ts'
import world from '@/entity/World.ts'
import { clamp } from '@/utils/function.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import Rapier from '@dimforge/rapier3d-compat'
import { Object3D, Vector3 } from 'three'
import * as THREE from 'three'
import InputController from '@/control/InputController.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState'

let player: any = null

export default () => {
  if (player !== null) {
    return player
  }

  let mesh: any = new Object3D()
  player = new Object3D()
  player.getPosition = () => {
    if (!mesh) {
      return new Vector3(0, 0, 0)
    }
    return mesh?.position
  }
  player.getRotation = () => {
    return mesh.quaternion
  }
  player.setRotation = (rotation: THREE.Quaternion) => {
    if (!mesh) {
      return
    }
    return mesh.quaternion.copy(rotation)
  }
  player.hp = 33
  player.previousHp = 33
  player.maxHp = 100
  player.mp = 77
  player.previousMp = 77
  player.maxMp = 100
  player.endurance = 100
  player.previousEndurance = 100
  player.maxEndurance = 100
  player.currentSpell = {
    speed: 1,
    damage: 25,
  }
  const playerVelocity = new Vector3(0, 0, 0)
  const isGrounded = false

  InputController()
  let mixer: any = {}
  const animationsMap: any = {}
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new THREE.Vector3(1, 0.25, 10.0)
  const velocity = new THREE.Vector3(0, 0, 0)

  // ✅ Create Rapier Kinematic Character Controller
  const characterController = state.physics.createCharacterController(0.000001) // `0.1` is skin width
  characterController.setMaxSlopeClimbAngle(45)
  characterController.setMinSlopeSlideAngle(30)
  characterController.enableSnapToGround(0.1)
  characterController.enableAutostep(0.3, 0.1, true)

  const stateMachine = new CharacterFSM(animationsMap)
  player.stateMachine = stateMachine

  player.dealDamage = (damage: number) => {
    player.previousHp = player.hp
    player.hp = clamp(player.hp + damage, 0, player.maxHp)
    player.previousMp = player.mp
    player.mp = clamp(player.mp - damage, 0, player.maxMp)
    player.previousEndurance = player.endurance
    player.endurance = clamp(player.endurance - damage - 5, 0, player.maxEndurance)
  }

  player.addHp = (heal: number) => {
    player.previousHp = player.hp
    player.hp = clamp(player.hp + heal, 0, player.maxHp)
  }

  let didDamage = false
  const TIME_INTERVAL = 6
  const updateLife = (timeInSeconds: number, elapsedTimeInS: number) => {
    // console.log('elapsedTimeInS: ', elapsedTimeInS)
    if (!didDamage && elapsedTimeInS % TIME_INTERVAL < 1.0) {
      player.dealDamage(23)
      didDamage = true
      // console.log('dealDamage: ', player.hp)
    } else if (didDamage && elapsedTimeInS % TIME_INTERVAL > TIME_INTERVAL - 1.0) {
      didDamage = false
    }
  }

  const loadModels = async () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    await loadCharacterModelWithAnimations({
      modelPath: '/models/thunder-fairy/thunder-fairy.fbx',
      parent: state.scene,
      position: new Vector3(6, -1, 5),
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
    const { rigidBody, collider } = createRigidBodyEntity(/*player.position */ new Vector3(12, 4, 5), 1)
    player.rigidBody = rigidBody
    player.collider = collider
  }
  initPhysics()

  const update = (timeInSeconds: number, elapsedTimeInS: number) => {
    if (!mesh) {
      return
    }

    if (stateMachine.currentState === null) {
      return
    }
    stateMachine.update(timeInSeconds, state.input)

    const frameDecceleration = new THREE.Vector3(velocity.x * decceleration.x, velocity.y * decceleration.y, velocity.z * decceleration.z)
    frameDecceleration.multiplyScalar(timeInSeconds)
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const controlObject = mesh
    const _Q = new THREE.Quaternion()
    const _A = new THREE.Vector3()
    const _R = controlObject.quaternion.clone()

    const acc = acceleration.clone()
    if (state.input.keysMap.shift) {
      acc.multiplyScalar(2.0)
    }

    if (stateMachine.currentState.name === 'cast') {
      acc.multiplyScalar(0.0)
    }

    if (stateMachine.currentState.name === 'jump') {
      acc.multiplyScalar(1.5)
    }

    if (state.input.keysMap.forward) {
      velocity.z += acc.z * timeInSeconds
    }
    if (state.input.keysMap.backward) {
      velocity.z -= acc.z * timeInSeconds
    }
    if (state.input.keysMap.left) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * acceleration.y)
      _R.multiply(_Q)
    }
    if (state.input.keysMap.right) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * acceleration.y)
      _R.multiply(_Q)
    }

    controlObject.quaternion.copy(_R)

    const oldPosition = new THREE.Vector3()
    oldPosition.copy(controlObject.position)

    const forward = new THREE.Vector3(0, 0, 1)
    forward.applyQuaternion(controlObject.quaternion)
    forward.normalize()

    const sideways = new THREE.Vector3(1, 0, 0)
    sideways.applyQuaternion(controlObject.quaternion)
    sideways.normalize()

    sideways.multiplyScalar(velocity.x * timeInSeconds)
    forward.multiplyScalar(velocity.z * timeInSeconds)

    controlObject.position.add(forward)
    controlObject.position.add(sideways)

    oldPosition.copy(controlObject.position)
    // player.position.copy(controlObject.position)
    // mesh.position.copy(controlObject.position)

    if (!player.rigidBody) return
    const movement = { forward: 0, right: 0 }

    // Calculate Movement Direction
    const moveSpeed = 0.1
    const direction = new THREE.Vector3()
    state.camera.getWorldDirection(direction)
    direction.y = 0 // Keep movement on the horizontal plane
    direction.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(state.camera.up, direction).normalize()

    if (state.input.keysMap.forward) {
      movement.forward += 1
    }
    if (state.input.keysMap.backward) {
      movement.forward -= 1
    }
    if (state.input.keysMap.left) {
      movement.right -= 1
    }
    if (state.input.keysMap.right) {
      movement.right += 1
    }
    const movementVector = new Rapier.Vector3(direction.x * movement.forward * moveSpeed + right.x * movement.right * moveSpeed, playerVelocity.y, direction.z * movement.forward * moveSpeed + right.z * movement.right * moveSpeed)
    const playerPos = player.rigidBody.translation()
    movementVector.x += playerPos.x
    movementVector.y += playerPos.y
    movementVector.z += playerPos.z
    // console.log('movementVector: ', movementVector)

    // ✅ Move Character Using Kinematic Controller
    const grav = new Rapier.Vector3(0, playerPos.y - timeInSeconds * timeInSeconds * 9.81, 0)
    characterController.computeColliderMovement(player.collider, grav)
    const correctedMovement1 = characterController.computedMovement()
    // console.log('correctedMovement1: ', correctedMovement1.y - grav.y)
    if (Math.abs(correctedMovement1.y - grav.y) < 0.001) {
      movementVector.y -= timeInSeconds * 9.81 * 0.25
    }

    characterController.computeColliderMovement(player.collider, movementVector)
    // isGrounded = characterController.computedMovementApplied() // Detect if grounded
    // for (let i = 0; i < characterController.numComputedCollisions(); i++) {
    //   const collision = characterController.computedCollision(i)
    // }
    const correctedMovement = characterController.computedMovement()

    if (characterController.numComputedCollisions()) {
      player.rigidBody.setNextKinematicTranslation(correctedMovement)
    } else {
      player.rigidBody.setNextKinematicTranslation(movementVector)
    }

    const meshPos = new Vector3(0, -0.9, 0).add(player.rigidBody.translation())
    // Update Three.js Mesh Position
    player.position.copy(meshPos)
    mesh.position.copy(meshPos)

    // player.position.copy(player.rigidBody.translation())
    // mesh.position.copy(player.rigidBody.translation())

    mixer?.update?.(timeInSeconds)

    updateLife(timeInSeconds, elapsedTimeInS)
  }

  state.addEvent('renderer.update', update)

  loadModels()

  state.player = player
  return player
}
