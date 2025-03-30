import { STRAFE_ROT_VELOCITY } from '@/utils/constants.ts'
import $ from '@/global'
import { clamp } from 'three/src/math/MathUtils.js'
import { Quaternion, Vector3 } from 'three'

export default () => {
  const rotation = new Quaternion()
  const translation = new Vector3(0, 2, 0)
  let phi = 0
  let theta = 0
  const phiSpeed = 8
  const thetaSpeed = 5
  let isHeadBobActive = false
  let headBobTimer = 0

  let fpsCamera: any = {}
  fpsCamera.setCameraRotation = (newPhi: number, newTheta: number) => {
    phi = newPhi
    theta = newTheta
  }
  fpsCamera.getCameraRotation = () => ({ phi, theta })

  const updateTranslation = (timeElapsedInS: number) => {
    const forwardVelocity = ($.controls.forward ? 1 : 0) + ($.controls.backward ? -1 : 0)
    const strafeVelocity = ($.controls.left ? 1 : 0) + ($.controls.right ? -1 : 0)

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

    if (forwardVelocity !== 0 || strafeVelocity !== 0) {
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
    /* calc the delta to rotate the character vertically
     * and horizontally */

    const xh = $.controls.mouse.mouseX / innerWidth
    const yh = $.controls.mouse.mouseY / innerHeight

    /* apply some speed constant to get an angle in radians [0, 2 PI] */
    phi += -xh * phiSpeed
    /* apply some speed constant to get an angle in radians [0, 2 PI],
     * but don't allow user to rotate too far up or too far down
     * -> [-60°, 60°] or [-PI/3, PI/3] in radians */
    theta = clamp(theta + ($.controls.lookBack ? -1 : 1) * yh * thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new Quaternion()
    /* (0, 1, 0) is Up Vector / y positive Vector and rotate it by phi,
     *  so setFromAxisAngle uses following formula:
     *  q = cos(phi/2) + sin(phi/2) * ^n, where ^n is the normalized axis vector   */
    qx.setFromAxisAngle(new Vector3(0, 1, 0), phi)
    const qz = new Quaternion()
    /* (1, 0, 0) is Right Vector / x positive Vector and rotate it by theta */
    qz.setFromAxisAngle(new Vector3(1, 0, 0), theta)

    /* multiply both quaternions to apply both rotations around the
     * y-axis with angle phi and around the x-axis with angle theta */
    const quaternionRotationTotal = new Quaternion()
    quaternionRotationTotal.multiply(qx)
    quaternionRotationTotal.multiply(qz)

    rotation.copy(quaternionRotationTotal)
  }

  const getXRotation = () => {
    let xh = $.controls.mouse.mouseX / innerWidth

    if ($.controls.left || $.controls.right) {
      xh = $.controls.left ? -STRAFE_ROT_VELOCITY / innerWidth : STRAFE_ROT_VELOCITY / innerWidth
    } else {
      xh = $.controls.mouse.mouseX / innerWidth
    }

    phi += -xh * phiSpeed
    const qx = new Quaternion()
    qx.setFromAxisAngle(new Vector3(0, 1, 0), phi)
    const q = new Quaternion()
    q.multiply(qx)
    return q
  }

  const updateCamera = () => {
    $.camera.quaternion.copy(rotation)
    $.camera.position.copy(translation)

    const playerModelQuaternion = $.player.getRotation()
    const playerModelPosition = $.player.getPosition()

    $.player.setRotation(getXRotation())
    if ($.controls.lookBack) {
      $.camera.quaternion.copy(playerModelQuaternion)
      /* define distance to playerModel position 1 up 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      $.camera.position.copy(idealCameraPosition)
    } else {
      $.camera.quaternion.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI))
      $.camera.position.copy(playerModelPosition)
      $.camera.position.y += 1.0
    }

    $.camera.position.y += Math.sin(headBobTimer * 10) * 0.025
  }

  const update = (timeElapsedInS: number) => {
    updateRotation()
    updateTranslation(timeElapsedInS)
    updateCamera()
    updateHeadBob(timeElapsedInS)
  }

  $.addEvent('renderer.update', (deltaInS: number) => {
    if (!$.controls || $.isThirdPerson) return

    update(deltaInS)
  })

  $.addEvent('level.cleanup', () => {
    fpsCamera = null
    $.fpsCamera = null
  })

  $.fpsCamera = fpsCamera
  return fpsCamera
}
