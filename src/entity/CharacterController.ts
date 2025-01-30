import * as THREE from 'three'
import InputController from '@/control/InputController.ts'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import CharacterFSM from '@/states/CharacterFSM.ts'

export default class CharacterController extends THREE.Object3D {
  player: any = null

  constructor() {
    super()

    this.init()
  }

  init() {
    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0)
    this.acceleration = new THREE.Vector3(1, 0.25, 10.0)
    this.velocity = new THREE.Vector3(0, 0, 0)

    this.animationsMap = {}
    this.inputController = new InputController()
    window.playerInput = this.inputController
    this.stateMachine = new CharacterFSM(this.animationsMap)

    this.loadModels()
  }

  async loadModels() {
    /*const loaderGlb = new GLTFLoader()
    const glb = await loaderGlb.loadAsync('/models/fairy/fairy.glb')
    for (const mesh of glb.scene.children) {
      this.model = mesh
      scene.add(mesh)
      mesh.position.set(0, 1, 0)
      this.mixer = new THREE.AnimationMixer(this.model)

      const onLoad = (animName: string, anim: any) => {
        const clip = anim.animations[0]
        const action = this.mixer.clipAction(clip)
        this.animationsMap[animName] = {
          clip: clip,
          action: action,
        }
      }

      const walkAnim = await loaderGlb.loadAsync('/models/fairy/walk.glb')
      onLoad('walk', walkAnim)
      const idleAnim = await loaderGlb.loadAsync('/models/fairy/idle.glb')
      onLoad('idle', idleAnim)
      console.log('idle: ')
      this.stateMachine.setState('idle')
    }*/

    const loader = new FBXLoader()
    loader.setPath('/models/fairy/')
    loader.load('/nature_fairy_1.fbx', (model: any) => {
      model.scale.setScalar(0.01)
      model.traverse((c: any) => {
        c.castShadow = true
      })
      // model.position.set(0, 2, 0)
      this.model = model
      scene.add(model)

      this.mixer = new THREE.AnimationMixer(model)

      this.loadingManager = new THREE.LoadingManager()
      this.loadingManager.onLoad = () => {
        this.stateMachine.setState('idle')
      }

      const onLoad = (animName: string, anim: any) => {
        const clip = anim.animations[0]
        const action = this.mixer.clipAction(clip)

        this.animationsMap[animName] = {
          clip: clip,
          action: action,
        }
      }

      const loader = new FBXLoader(this.loadingManager)
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

  get getPosition() {
    return this.position
  }

  get getRotation() {
    if (!this.model) {
      return new THREE.Quaternion()
    }
    return this.model.quaternion
  }

  update(timeInSeconds: number) {
    if (!this.model) {
      return
    }

    if (this.stateMachine.currentState === null) {
      return
    }
    this.stateMachine.update(timeInSeconds, this.inputController)

    const velocity = this.velocity
    const frameDecceleration = new THREE.Vector3(velocity.x * this.decceleration.x, velocity.y * this.decceleration.y, velocity.z * this.decceleration.z)
    frameDecceleration.multiplyScalar(timeInSeconds)
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

    velocity.add(frameDecceleration)

    const controlObject = this.model
    const _Q = new THREE.Quaternion()
    const _A = new THREE.Vector3()
    const _R = controlObject.quaternion.clone()

    const acc = this.acceleration.clone()
    if (this.inputController.keysMap.shift) {
      acc.multiplyScalar(2.0)
    }

    if (this.stateMachine.currentState.name === 'dance') {
      acc.multiplyScalar(0.0)
    }

    if (this.stateMachine.currentState.name === 'jump') {
      acc.multiplyScalar(1.5)
    }

    if (this.inputController.keysMap.forward) {
      velocity.z += acc.z * timeInSeconds
    }
    if (this.inputController.keysMap.backward) {
      velocity.z -= acc.z * timeInSeconds
    }
    if (this.inputController.keysMap.left) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this.acceleration.y)
      _R.multiply(_Q)
    }
    if (this.inputController.keysMap.right) {
      _A.set(0, 1, 0)
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this.acceleration.y)
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
    this.position.copy(controlObject.position)

    if (this.mixer) {
      this.mixer.update(timeInSeconds)
    }
  }
}
