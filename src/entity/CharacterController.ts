import { Object3D, Vector3 } from 'three'
import * as THREE from 'three'
import InputController from '@/control/InputController.ts'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
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
      return new Vector3(0,0,0)
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

  InputController()
  let mixer: any = null
  let loadingManager = null
  let animationsMap: any = {}
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
  const acceleration = new THREE.Vector3(1, 0.25, 10.0)
  const velocity = new THREE.Vector3(0, 0, 0)

  const stateMachine = new CharacterFSM(animationsMap)

  const loadModels = () => {
    const loader = new FBXLoader()
    loader.setPath('/models/fairy/')
    loader.load('/nature_fairy_1.fbx', (model: any) => {
      model.scale.setScalar(0.01)
      model.traverse((c: any) => {
        c.castShadow = true
      })
      mesh = model
      state.scene.add(mesh)

      mixer = new THREE.AnimationMixer(mesh)

      loadingManager = new THREE.LoadingManager()
      loadingManager.onLoad = () => {
        stateMachine.setState('idle')
      }

      const onLoad = (animName: string, anim: any) => {
        const clip = anim.animations[0]
        const action = mixer.clipAction(clip)

        animationsMap[animName] = {
          clip: clip,
          action: action,
        }
      }

      const loader = new FBXLoader(loadingManager)
      loader.setPath('/models/fairy/')
      loader.load('walk.fbx', (anim: any) => {
        onLoad('walk', anim)
      })
      loader.load('run.fbx', (anim: any) => {
        onLoad('run', anim)
      })
      loader.load('idle.fbx', (anim: any) => {
        onLoad('idle', anim)
      })
      loader.load('angry.fbx', (anim: any) => {
        onLoad('dance', anim)
      })
      loader.load('cast.fbx', (anim: any) => {
        onLoad('cast', anim)
      })
      loader.load('jump.fbx', (anim: any) => {
        onLoad('jump', anim)
      })
    })
  }

  const update = (timeInSeconds: number) => {
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

    if (mixer) {
      mixer.update(timeInSeconds)
    }
  }

  state.addEvent('renderer.update', (deltaInS: number) => {
    update(deltaInS)
  })
  
  loadModels()

  state.player = player
  return player
}
