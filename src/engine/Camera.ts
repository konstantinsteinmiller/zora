import FirstPersonCamera from '@/engine/FirstPersonCamera.ts'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'
import state from '@/states/GlobalState.ts'
import * as THREE from 'three'
import { PerspectiveCamera } from 'three'

export default () => {
  const aspect = window.innerWidth / window.innerHeight

  const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.5, 5000)
  camera.position.set(0, 2, 0)
  state.camera = camera

  state.uiCamera = new THREE.OrthographicCamera(-1, 1, aspect, -1 * aspect, 1, 100)

  ThirdPersonCamera()
  FirstPersonCamera()

  return camera
}