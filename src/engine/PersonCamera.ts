import { STRAFE_VELOCITY } from '@/utils/constants.ts'
import state from '@/states/GlobalState.ts'
import { clamp } from 'three/src/math/MathUtils'
import { Quaternion, Vector3 } from 'three'

export default () => {
  const rotation = new Quaternion()
  const translation = new Vector3(0, 1, 0)
  let phi = 0
  let theta = 0
  const phiSpeed = 8
  const thetaSpeed = 5
  let isHeadBobActive = false
  let headBobTimer = 0

  let personCamera: any = {}
  personCamera.setCameraRotation = (newPhi: number, newTheta: number) => {
    phi = newPhi
    theta = newTheta
  }
  personCamera.getCameraRotation = () => ({ phi, theta })

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

      if (state.isThirdPerson) {
        const idealCameraOffset = new Vector3(-0.5, 2, -3.5)
        idealCameraOffset.applyQuaternion(playerModelQuaternion)
        idealCameraOffset.add(playerModelPosition)
        state.camera.position.copy(idealCameraOffset)
      } else {
        state.camera.position.copy(playerModelPosition)
        state.camera.position.y += 1.0
      }
    }

    if (!state.isThirdPerson) {
      state.camera.position.y += Math.sin(headBobTimer * 10) * 0.025
    }
  }

  const getXRotation = () => {
    let xh: number
    if (state.controls.left || state.controls.right) {
      xh = state.controls.left ? -STRAFE_VELOCITY / innerWidth : STRAFE_VELOCITY / innerWidth
    } else {
      xh = state.controls.mouse.mouseX / innerWidth
    }

    phi += -xh * phiSpeed
    const qx = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), phi)
    return new Quaternion().multiply(qx)
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

    if (!state.isThirdPerson && (forwardVelocity !== 0 || strafeVelocity !== 0)) {
      isHeadBobActive = true
    }
  }

  const updateHeadBob = (timeElapsedInS: number) => {
    if (isHeadBobActive) {
      const wavelength = Math.PI
      const nextStep = 1 + Math.floor(((headBobTimer + 0.000001) * 10) / wavelength)
      const nextStepTime = (nextStep * wavelength) / 10
      headBobTimer = Math.min(headBobTimer + timeElapsedInS, nextStepTime)

      if (headBobTimer == nextStepTime) {
        isHeadBobActive = false
      }
    }
  }

  const updateRotation = () => {
    /* calc the delta to rotate the character vertically and horizontally */
    const xh = state.controls.mouse.mouseX / innerWidth
    const yh = state.controls.mouse.mouseY / innerHeight

    /* apply some speed constant to get an angle in radians [0, 2 PI] */
    phi += -xh * phiSpeed
    /* apply some speed constant to get an angle in radians [0, 2 PI],
     * but don't allow user to rotate too far up or too far down
     * -> [-60°, 60°] or [-PI/3, PI/3] in radians */
    theta = clamp(theta + (state.controls.lookBack ? -1 : 1) * yh * thetaSpeed, -Math.PI / 3, Math.PI / 3)

    /* (0, 1, 0) is Up Vector / y positive Vector and rotate it by phi,
     *  so setFromAxisAngle uses following formula:
     *  q = cos(phi/2) + sin(phi/2) * ^n, where ^n is the normalized axis vector   */
    const qx = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), phi)

    /* (1, 0, 0) is Right Vector / x positive Vector and rotate it by theta */
    const qz = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), theta)

    /* multiply both quaternions to apply both rotations around the
     * y-axis with angle phi and around the x-axis with angle theta */
    const quaternionRotationTotal = new Quaternion().multiply(qx).multiply(qz)

    rotation.slerp(quaternionRotationTotal, 0.3)
  }

  const update = (elapsedTimeInS: number) => {
    updateRotation()
    updateTranslation(elapsedTimeInS)
    updateCamera()
    !state.isThirdPerson && updateHeadBob(elapsedTimeInS)
  }

  state.addEvent('renderer.update', (deltaInS: number) => {
    if (!state.controls) return
    update(deltaInS)
  })

  state.addEvent('arena.cleanup', () => {
    personCamera = null
    state.personCamera = null
  })

  state.personCamera = personCamera
  return personCamera
}
