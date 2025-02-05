import AssetLoader from '@/engine/AssetLoader.ts'
import { clamp } from '@/utils/function.ts'
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

  InputController()
  let mixer: any = {}
  const animationsMap: any = {}
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new THREE.Vector3(1, 0.25, 10.0)
  const velocity = new THREE.Vector3(0, 0, 0)

  const stateMachine = new CharacterFSM(animationsMap)

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

  const loadModels = () => {
    const { loadCharacterModelWithAnimations } = AssetLoader()
    loadCharacterModelWithAnimations({
      modelPath: '/models/fairy/nature_fairy_1.fbx',
      parent: state.scene,
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
    player.position.copy(controlObject.position)
    mesh.position.copy(controlObject.position)

    mixer?.update?.(timeInSeconds)

    updateLife(timeInSeconds, elapsedTimeInS)
  }

  state.addEvent('renderer.update', update)

  loadModels()

  state.player = player
  return player
}
