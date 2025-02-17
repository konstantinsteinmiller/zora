import AssetLoader from '@/engine/AssetLoader.ts'
import { controllerFunctions, controllerUtils } from '@/utils/controller.ts'
import { createRigidBodyEntity } from '@/utils/physics.ts'
import { Object3D, Quaternion, Vector3 } from 'three'
import * as THREE from 'three'
import InputController from '@/control/InputController.ts'
import CharacterFSM from '@/states/CharacterFSM.ts'
import state from '@/states/GlobalState'
import { calcRapierMovementVector } from '@/utils/collision'

let player: any = null

const baseStats: any = {
  name: 'player',
  hp: 33,
  previousHp: 33,
  maxHp: 100,
  mp: 77,
  previousMp: 77,
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

export default ({ modelPath, stats, startPosition, modelHeight = 1.8 }: { modelPath: string; stats: any; startPosition: Vector3; modelHeight: number }) => {
  if (player !== null) {
    return player
  }

  let mesh: any = new Object3D()
  mesh.position.copy(startPosition)
  const halfHeight = modelHeight * 0.5

  player = {
    ...new Object3D(),
    ...(stats ? stats : baseStats),
    ...controllerUtils(),
    ...controllerFunctions(),
    mesh: mesh,
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

  InputController()
  let mixer: any = {}
  const animationsMap: any = {}
  const decceleration = new Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new Vector3(1, 0.25, 15.0)
  const currentVelocity = new Vector3(0, 0, 0)

  const stateMachine = new CharacterFSM(animationsMap, player)
  player.stateMachine = stateMachine

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
        player.mesh = mesh
      },
    })
  }
  loadModels()

  const initPhysics = () => {
    const { rigidBody, collider } = createRigidBodyEntity(startPosition, halfHeight)
    player.rigidBody = rigidBody
    player.collider = collider
  }
  initPhysics()

  const calcVelocityAndRotation = (velocity: Vector3, deltaS: number) => {
    const frameDecceleration = new Vector3(velocity.x * decceleration.x, velocity.y * decceleration.y, velocity.z * decceleration.z)
    frameDecceleration.multiplyScalar(deltaS)
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

    if (stateMachine.currentState.name === 'jump' && !state.input.keysMap.shift) {
      acc.multiplyScalar(1.5)
    }

    if (state.input.keysMap.forward) {
      velocity.z += acc.z * deltaS
    }
    if (state.input.keysMap.backward) {
      velocity.z -= acc.z * deltaS
    }
    if (state.input.keysMap.left) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * deltaS * acceleration.y)
      _R.multiply(_Q)
    }
    if (state.input.keysMap.right) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * deltaS * acceleration.y)
      _R.multiply(_Q)
    }
    return { _R, velocity }
  }

  const update = (deltaS: number, elapsedTimeInS: number) => {
    if (!mesh || stateMachine.currentState === null) {
      return
    }
    stateMachine.update(deltaS, state.input)

    const { _R, velocity } = calcVelocityAndRotation(currentVelocity, deltaS)

    player.mesh.quaternion.slerp(_R, 0.1) // Smooth interpolation

    const movementVector = calcRapierMovementVector(player, velocity, deltaS)

    /* apply rotation and translation to physical body */
    player.rigidBody.setNextKinematicRotation(player.getRotation())
    player.rigidBody.setNextKinematicTranslation(movementVector)

    /* correct mesh position in physics capsule */
    const meshPos = new Vector3(0, -player.halfHeight, 0).add(player.rigidBody.translation())
    /* Update Three.js Mesh Position */
    player.position.copy(meshPos)
    mesh.position.copy(meshPos)

    mixer?.update?.(deltaS)

    player.updateLife(player, elapsedTimeInS)
  }

  state.addEvent('renderer.update', update)

  state.player = player
  return player
}
