import FirstPersonCamera from '@/engine/FirstPersonCamera.ts'
import ThirdPersonCamera from '@/engine/ThirdPersonCamera.ts'
import state from '@/states/GlobalState.ts'
import { OrthographicCamera, PerspectiveCamera } from 'three'

export default () => {
  const aspect = innerWidth / innerHeight

  const camera: any = new PerspectiveCamera(60, innerWidth / innerHeight, 0.5, 5000)
  camera.position.set(0, 2, 0)

  camera.updateCameraRotation = () => {
    if (state.isThirdPerson) {
      const { phi, theta } = state.fpsCamera.getCameraRotation()
      state.thirdPersonCamera.setCameraRotation(phi, theta)
    } else {
      const { phi, theta } = state.thirdPersonCamera.getCameraRotation()
      state.fpsCamera.setCameraRotation(phi, theta)
    }
  }

  state.camera = camera

  state.uiCamera = new OrthographicCamera(-1, 1, aspect, -1 * aspect, 1, 100)
  state.uiCamera.position.set(0, 0, 1)

  const aspectRatio = innerWidth / innerHeight
  state.uiCamera.left = -aspectRatio
  state.uiCamera.right = aspectRatio
  state.uiCamera.top = 1
  state.uiCamera.bottom = -1
  state.uiCamera?.updateProjectionMatrix()

  ThirdPersonCamera()
  FirstPersonCamera()

  return camera
}
