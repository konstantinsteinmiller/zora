import { STRAFE_ROT_VELOCITY } from '@/utils/constants.ts'
import $ from '@/global'
import { clamp } from 'three/src/math/MathUtils.js'
import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from 'three'

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

  const updateMenuCamera = () => {
    if (!$.player || !$.targetToFocus.value || !$.camera) return

    const playerPosition = $.player.getPosition()
    const npcPosition = new Vector3(
      $.targetToFocus.value.position.x,
      $.player.getPosition().y + $.player.halfHeight - 0.3, // Adjust NPC target height
      $.targetToFocus.value.position.z
    )

    // Calculate the target rotation so the player faces the NPC (around Y-axis only)
    const directionToNPC = new Vector3().subVectors(npcPosition, playerPosition).normalize()
    const targetPlayerYRotation = Math.atan2(directionToNPC.x, directionToNPC.z)
    const currentYQuaternion = $.player.getRotation()
    const targetYQuaternion = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), targetPlayerYRotation)
    currentYQuaternion.slerp(targetYQuaternion, 0.1)
    $.player.setRotation(currentYQuaternion)

    // Calculate the ideal camera position behind the player's shoulder
    const playerWorldQuaternion = $.player.getRotation()
    const playerWorldPosition = $.player.getPosition()
    const shoulderOffset = new Vector3(-2.25, 2.5, -2.25) // Adjust for better shoulder view
    shoulderOffset.applyQuaternion(playerWorldQuaternion)
    const targetCameraPosition = new Vector3().addVectors(playerWorldPosition, shoulderOffset)

    $.camera.position.lerp(targetCameraPosition, 0.1)

    // Calculate the target camera rotation to look at the NPC
    const cameraLookAtPosition = new Vector3(npcPosition.x, npcPosition.y + 1.5, npcPosition.z) // Adjust NPC look at height
    const targetCameraRotation = new Quaternion().setFromRotationMatrix(
      new Matrix4().lookAt($.camera.position, cameraLookAtPosition, new Vector3(0, 1, 0))
    )
    $.camera.quaternion.slerp(targetCameraRotation, 0.1)
  }

  const updateCamera = () => {
    if ($.isMenu?.value) {
      updateMenuCamera()
      return
    }

    $.camera.quaternion.copy(rotation)
    $.camera.position.copy(translation)

    const playerModelQuaternion = $.player.getRotation()
    const playerModelPosition = $.player.getPosition()

    $.player.setRotation(getXRotation())
    if ($.controls.lookBack) {
      $.camera.quaternion.slerp(playerModelQuaternion, 0.3)
      /* define distance to playerModel position 1 up and 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      $.camera.position.copy(idealCameraPosition)
    } else {
      $.camera.quaternion.multiply(
        new Quaternion().setFromAxisAngle(
          new Vector3(0, 1, 0),
          -Math.PI /*
           */
        )
      )

      if ($.isThirdPerson) {
        const idealCameraOffset = new Vector3(-0.5, 2, -3.5)
        idealCameraOffset.applyQuaternion(playerModelQuaternion)
        idealCameraOffset.add(playerModelPosition)
        $.camera.position.copy(idealCameraOffset)
      } else {
        $.camera.position.copy(playerModelPosition)
        $.camera.position.y += 1.0
      }
    }

    if (!$.isThirdPerson) {
      $.camera.position.y += Math.sin(headBobTimer * 10) * 0.025
    }
  }

  const getXRotation = () => {
    let xh: number = 0
    if ($.controls.rotateLeft || $.controls.rotateRight) {
      xh = $.controls.rotateLeft ? -STRAFE_ROT_VELOCITY / innerWidth : STRAFE_ROT_VELOCITY / innerWidth
    } else if (document.pointerLockElement) {
      xh = $.controls.mouse.mouseX / innerWidth
    }

    phi += -xh * phiSpeed
    const qx = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), phi)
    return new Quaternion().multiply(qx)
  }

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

    if (!$.isThirdPerson && (forwardVelocity !== 0 || strafeVelocity !== 0)) {
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
    if (!document.pointerLockElement) return
    /* calc the delta to rotate the character vertically and horizontally */
    const xh = $.controls.mouse.mouseX / innerWidth
    const yh = $.controls.mouse.mouseY / innerHeight

    /* apply some speed constant to get an angle in radians [0, 2 PI] */
    phi += -xh * phiSpeed
    /* apply some speed constant to get an angle in radians [0, 2 PI],
     * but don't allow user to rotate too far up or too far down
     * -> [-60°, 60°] or [-PI/3, PI/3] in radians */
    theta = clamp(theta + ($.controls.lookBack ? -1 : 1) * yh * thetaSpeed, -Math.PI / 3, Math.PI / 3)

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
    /* updateTranslation is obsolete as the movement is handled in collision.ts */
    // updateTranslation(elapsedTimeInS)
    updateCamera()
    !$.isThirdPerson && updateHeadBob(elapsedTimeInS)
  }

  $.addEvent('renderer.update', (deltaInS: number) => {
    if (!$.controls) return
    update(deltaInS)
  })

  $.addEvent('level.cleanup', () => {
    personCamera = null
    $.personCamera = null
  })

  $.personCamera = personCamera
  return personCamera
}
