import AssetLoader from '@/engine/AssetLoader.ts'
import { clamp } from '@/utils/function.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import Rapier, { Capsule, QueryFilterFlags, Ray } from '@dimforge/rapier3d-compat'
import { Object3D, Vector3 } from 'three'
import * as THREE from 'three'
import InputController from '@/control/InputController.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState'

let player: any = null

export default (modelHeight: number = 1.8) => {
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
    const prevQuat = mesh.quaternion.clone()
    prevQuat.slerp(rotation, 0.2) // Smooth interpolation
    player.rigidBody.setRotation(prevQuat)
    return mesh.quaternion.copy(prevQuat)
  }
  player.mesh = mesh
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
  player.isGrounded = false
  const halfHeight = modelHeight * 0.5

  InputController()
  let mixer: any = {}
  const animationsMap: any = {}
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new THREE.Vector3(1, 0.25, 15.0)
  const velocity = new THREE.Vector3(0, 0, 0)

  // ✅ Create Rapier Kinematic Character Controller
  const characterController = state.physics.createCharacterController(0.01) // `0.1` is skin width
  characterController.setMaxSlopeClimbAngle((45 * Math.PI) / 180)
  characterController.setMinSlopeSlideAngle((30 * Math.PI) / 180)
  characterController.enableSnapToGround(0.5)
  characterController.enableAutostep(0.5, 0.2, true)

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
      position: new Vector3(6, 0, 5),
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
    const { rigidBody, collider } = createRigidBodyEntity(
      /*player.position,
       */ new Vector3(10.5, 0, 5),
      halfHeight
    )
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

    const _Q = new THREE.Quaternion()
    const _A = new THREE.Vector3()
    const _R = mesh.quaternion.clone()

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

    mesh.quaternion.slerp(_R, 0.1) // Smooth interpolation
    // mesh.quaternion.copy(_R)

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

    if (!player.rigidBody) return

    const movementVector = new Rapier.Vector3(forward.x + sideways.x, forward.y + sideways.y, forward.z + sideways.z)
    const playerPos = player.rigidBody.translation()
    movementVector.x += playerPos.x
    movementVector.y += playerPos.y
    movementVector.z += playerPos.z

    /* implement ray cast down to detect ground and only apply
     * gravity when not grounded */
    const physicsRayDown = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 })
    movementVector.y += -4 * timeInSeconds

    physicsRayDown.origin = playerPos
    let hit = state.physics.castRay(physicsRayDown, halfHeight, false, 0xff0000ff)
    if (hit) {
      /* isGrounded determines if player can jump or start flying */
      player.isGrounded = true
      movementVector.y = playerPos.y
      const point = physicsRayDown.pointAt(hit.timeOfImpact)
      let diff = +(playerPos.y - (point.y + halfHeight)).toFixed(3)
      // console.log('point: ', diff)
      if (diff < 0.05 && diff > -0.3) {
        if (diff > 0) {
          diff = 0
        }
        movementVector.y = playerPos.y - diff
      }
    }

    /* shape cast into movementVector direction to find obstacles */
    const shapePos = { x: movementVector.x, y: movementVector.y + halfHeight - 0.1, z: movementVector.z }
    const shapeRot = player.rigidBody.rotation()
    const shapeVel = movementVector
    const shape = new Capsule(0.7, 0.4)
    const targetDistance = 0.0
    const maxToi = 0.1
    // Optional parameters:
    const stopAtPenetration = true
    const filterFlags = QueryFilterFlags.EXCLUDE_DYNAMIC
    const filterGroups = 0x000b0001
    const filterExcludeCollider = player.collider
    const filterExcludeRigidBody = player.rigidBody

    hit = state.physics.castShape(shapePos, shapeRot, shapeVel, shape, targetDistance, maxToi, stopAtPenetration, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
    if (hit != null) {
      // console.log('hit: ', hit)
      const normal = new Vector3(hit.normal1.x, hit.normal1.y, hit.normal1.z).normalize()
      const normal2 = new Vector3(hit.normal2.x, hit.normal2.y, hit.normal2.z).normalize()

      // Project movement onto the surface to allow sliding
      const movementDir = /*normal2*/ new Vector3(movementVector.x - playerPos.x, 0, movementVector.z - playerPos.z)
      const dotProduct = movementDir.dot(normal)

      // Remove the component of movement that goes into the wall
      movementDir.sub(normal.multiplyScalar(dotProduct))
      if (dotProduct < 0) {
        // Apply the adjusted movement vector
        movementVector.x = playerPos.x + movementDir.x
        movementVector.z = playerPos.z + movementDir.z
      } else {
        // movementVector.x = playerPos.x
        // movementVector.z = playerPos.z
      }

      // previousPos.copy(movementVector)
      // if (previousPos.x === playerPos.x && previousPos.z === playerPos.z) {
      //   console.log('player is stuck: ')
      // }
      // console.log('Hit the collider', hit.collider, 'at time', hit.time_of_impact)
    }

    // characterController.computeColliderMovement(player.collider, movementVector)
    // const correctedMovement = characterController.computedMovement()

    // // 🔥 Wall Sliding Logic
    // if (characterController.numComputedCollisions() > 0) {
    //   for (let i = 0; i < characterController.numComputedCollisions(); i++) {
    //     const collision = characterController.computedCollision(i)
    //     const normal = collision.normal1
    //     // console.log('collision: ', collision)
    //
    //     const movementVectorThree = new Vector3(movementVector.x, movementVector.y, movementVector.z)
    //     const normalThree = new Vector3(normal.x, normal.y, normal.z)
    //
    //     const dot = movementVectorThree.dot(normalThree)
    //     const slideVector = movementVectorThree.sub(normalThree.multiplyScalar(dot))
    //
    //     correctedMovement = new Rapier.Vector3(slideVector.x, slideVector.y, slideVector.z)
    //   }
    // }

    // player.rigidBody.setNextKinematicTranslation(correctedMovement)

    player.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -halfHeight, 0).add(player.rigidBody.translation())
    // Update Three.js Mesh Position
    player.position.copy(meshPos)
    mesh.position.copy(meshPos)

    mixer?.update?.(timeInSeconds)

    updateLife(timeInSeconds, elapsedTimeInS)
  }

  state.addEvent('renderer.update', update)

  loadModels()

  state.player = player
  return player
}
