import AssetLoader from '@/engine/AssetLoader.ts'
import { controllerFunctions, controllerUtils } from '@/utils/controller.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import Rapier, { Capsule, QueryFilterFlags, Ray } from '@dimforge/rapier3d-compat'
import { Object3D, Quaternion, Vector3 } from 'three'
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
  const halfHeight = modelHeight * 0.5

  player = {
    ...new Object3D(),
    mesh: mesh,
    ...controllerUtils(),
    ...controllerFunctions(),
    halfHeight,
  }
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
  player.name = 'player'
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
    name: 'shot',
    speed: 1,
    damage: 25,
  }
  player.isGrounded = false

  InputController()
  let mixer: any = {}
  const animationsMap: any = {}
  const decceleration = new Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new Vector3(1, 0.25, 15.0)
  const velocity = new Vector3(0, 0, 0)

  const stateMachine = new CharacterFSM(animationsMap, player)
  player.stateMachine = stateMachine

  const loadModels = async () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    await loadCharacterModelWithAnimations({
      modelPath: '/models/thunder-fairy/thunder-fairy.fbx',
      parent: state.scene,
      position: new Vector3(8.5, 0, 3),
      scale: 0.01,
      stateMachine,
      animationsMap,
      animationNamesList: ['walk', 'run', 'idle', 'dance', 'cast', 'jump'],
      callback: (scope: any) => {
        mixer = scope.mixer
        mesh = scope.mesh
        player.mesh = mesh
      },
    })
  }

  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity(new Vector3(10.5, 0, 5), halfHeight)
    player.rigidBody = rigidBody
    player.collider = collider
  }
  initPhysics()

  const update = (timeInSeconds: number, elapsedTimeInS: number) => {
    if (!mesh || stateMachine.currentState === null) {
      return
    }
    stateMachine.update(timeInSeconds, state.input)

    const frameDecceleration = new Vector3(velocity.x * decceleration.x, velocity.y * decceleration.y, velocity.z * decceleration.z)
    frameDecceleration.multiplyScalar(timeInSeconds)
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const _Q = new Quaternion()
    const _A = new Vector3()
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
    const rigidPos = player.rigidBody.translation()
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
      player.isGrounded = true
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
    player.rigidBody.setNextKinematicRotation(meshQuat)
    player.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -halfHeight, 0).add(player.rigidBody.translation())
    // Update Three.js Mesh Position
    player.position.copy(meshPos)
    mesh.position.copy(meshPos)

    mixer?.update?.(timeInSeconds)

    player.updateLife(player, elapsedTimeInS)
  }

  state.addEvent('renderer.update', update)

  loadModels()

  state.player = player
  return player
}
