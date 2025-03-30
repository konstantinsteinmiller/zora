import PersonCamera from '@/engine/PersonCamera.ts'
import $ from '@/global'
import { OrthographicCamera, PerspectiveCamera } from 'three'

export default () => {
  const aspect = innerWidth / innerHeight

  let camera: any = new PerspectiveCamera(60, innerWidth / innerHeight, 0.5, 5000)
  camera.position.set(0, 2, 0)

  camera.updateCameraRotation = () => {
    /* obsolete code after PersonCamera to update from one camera to other */
    if ($.isThirdPerson) {
      const { phi, theta } = $.fpsCamera.getCameraRotation()
      $.thirdPersonCamera.setCameraRotation(phi, theta)
    } else {
      const { phi, theta } = $.thirdPersonCamera.getCameraRotation()
      $.fpsCamera.setCameraRotation(phi, theta)
    }
  }

  $.camera = camera

  $.uiCamera = new OrthographicCamera(-1, 1, aspect, -1 * aspect, 1, 100)
  $.uiCamera.position.set(0, 0, 1)

  const aspectRatio = innerWidth / innerHeight
  $.uiCamera.left = -aspectRatio
  $.uiCamera.right = aspectRatio
  $.uiCamera.top = 1
  $.uiCamera.bottom = -1
  $.uiCamera?.updateProjectionMatrix()

  $.addEvent('level.cleanup', () => {
    camera = null
    $.camera = null
    $.uiCamera = null
  })

  /* manipulates $.camera */
  PersonCamera()

  return camera
}
