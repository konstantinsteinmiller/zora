import PersonCamera from '@/engine/PersonCamera.ts'
import state from '@/states/GlobalState.ts'
import { OrthographicCamera, PerspectiveCamera } from 'three'

export default () => {
  const aspect = innerWidth / innerHeight

  let camera: any = new PerspectiveCamera(60, innerWidth / innerHeight, 0.5, 5000)
  camera.position.set(0, 2, 0)

  camera.updateCameraRotation = () => {
    /* obsolete code after PersonCamera to update from one camera to other */
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

  state.addEvent('arena.cleanup', () => {
    camera = null
    state.camera = null
    state.uiCamera = null
  })

  /* manipulates state.camera */
  PersonCamera()

  return camera
}
