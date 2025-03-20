import { STRAFE_ROT_VELOCITY } from '@/utils/constants.ts'
import state from '@/states/GlobalState.ts'
import { Quaternion, Vector3 } from 'three'
import { clamp } from 'three/src/math/MathUtils.js'

export default () => {
  let thirdPersonCamera: any = {}

  const rotation = new Quaternion()
  const translation = new Vector3(0, 1, 0)
  let phi = 0
  let theta = 0
  const phiSpeed = 8
  const thetaSpeed = 5

  thirdPersonCamera.setCameraRotation = (newPhi: number, newTheta: number) => {
    phi = newPhi
    theta = newTheta
  }
  thirdPersonCamera.getCameraRotation = () => ({ phi, theta })

  const updateCamera = () => {
    state.camera.quaternion.copy(rotation)
    state.camera.position.copy(translation)

    const playerModelQuaternion = state.player.getRotation()
    const playerModelPosition = state.player.getPosition()

    state.player.setRotation(getXRotation())
    if (state.controls.lookBack) {
      state.camera.quaternion.slerp(playerModelQuaternion, 0.3)
      /* define distance to playerModel position 1 up and 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      state.camera.position.copy(idealCameraPosition)
    } else {
      state.camera.quaternion.multiply(
        new Quaternion().setFromAxisAngle(
          new Vector3(0, 1, 0),
          -Math.PI /*
           */
        )
      )
      const idealCameraOffset = new Vector3(-0.5, 2, -3.5)
      idealCameraOffset.applyQuaternion(playerModelQuaternion)
      idealCameraOffset.add(playerModelPosition)
      state.camera.position.copy(idealCameraOffset)
    }
  }

  const getXRotation = () => {
    let xh: number
    if (state.controls.left || state.controls.right) {
      xh = state.controls.left ? -STRAFE_ROT_VELOCITY / innerWidth : STRAFE_ROT_VELOCITY / innerWidth
    } else {
      xh = state.controls.mouse.mouseX / innerWidth
    }

    phi += -xh * phiSpeed
    const qx = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), phi)
    const q = new Quaternion().multiply(qx)
    return q
  }

  const updateTranslation = (timeElapsedInS: number) => {
    const forwardVelocity = (state.controls.forward ? 1 : 0) + (state.controls.backward ? -1 : 0)
    const strafeVelocity = (state.controls.left ? 1 : 0) + (state.controls.right ? -1 : 0)

    const qx = new Quaternion()
    qx.setFromAxisAngle(new Vector3(0, 1, 0), phi)

    const forward = new Vector3(0, 0, -1)
    forward.applyQuaternion(qx)
    // console.log('timeElapsedInS: ', timeElapsedInS)
    forward.multiplyScalar(forwardVelocity * timeElapsedInS * 2)

    const left = new Vector3(-1, 0, 0)
    left.applyQuaternion(qx)
    left.multiplyScalar(strafeVelocity * timeElapsedInS * 2)

    translation.add(forward)
    translation.add(left)
  }

  const updateRotation = () => {
    const xh = state.controls.mouse.mouseX / innerWidth
    const yh = state.controls.mouse.mouseY / innerHeight

    phi += -xh * phiSpeed
    theta = clamp(theta + (state.controls.lookBack ? -1 : 1) * yh * thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), phi)
    const qz = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), theta)
    const q = new Quaternion().multiply(qx).multiply(qz)

    rotation.slerp(q, 0.3)
  }

  const update = (elapsedTimeInS: number) => {
    updateRotation()
    updateTranslation(elapsedTimeInS)
    updateCamera()
  }

  state.addEvent('renderer.update', (deltaInS: number) => {
    if (!state.controls || !state.isThirdPerson) return

    update(deltaInS)
  })

  state.addEvent('arena.cleanup', () => {
    thirdPersonCamera = null
    state.thirdPersonCamera = null
  })

  state.thirdPersonCamera = thirdPersonCamera
  return thirdPersonCamera
}
