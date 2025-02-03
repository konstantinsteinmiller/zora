import state from '@/states/GlobalState.ts'
import * as THREE from 'three'
import { clamp } from '@/utils/function.ts'
import { Vector3 } from 'three'

let fpsCamera: any = null

export default () => {
  /* fpsCamera is a Singleton */
  if (fpsCamera !== null) {
    return fpsCamera
  }

  const input = state.input
  let rotation = new THREE.Quaternion()
  let translation = new THREE.Vector3(0, 2, 0)
  let phi = 0
  let theta = 0
  let phiSpeed = 8
  let thetaSpeed = 5
  let isHeadBobActive = false
  let headBobTimer = 0

  fpsCamera = {

  }


  state.fpsCamera = fpsCamera

  const updateTranslation = (timeElapsedInS: number) => {
    const forwardVelocity = (input.keysMap.forward ? 1 : 0) + (input.keysMap.backward ? -1 : 0)
    const strafeVelocity = (input.keysMap.left ? 1 : 0) + (input.keysMap.right ? -1 : 0)

    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), phi)

    const forward = new THREE.Vector3(0, 0, -1)
    forward.applyQuaternion(qx)
    // console.log('timeElapsedInS: ', timeElapsedInS)
    forward.multiplyScalar(forwardVelocity * timeElapsedInS * 2)

    const left = new THREE.Vector3(-1, 0, 0)
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
    /* calc the delta to rotate the character vertically */
    /* calc the delta to rotate the character horizontally */

    const xh = input.current.mouseXDelta / innerWidth
    const yh = input.current.mouseYDelta / innerHeight

    /* apply some speed constant to get an angle in radians [0, 2 PI] */
    phi += -xh * phiSpeed
    /* apply some speed constant to get an angle in radians [0, 2 PI],
     * but don't allow user to rotate too far up or too far down
     * -> [-60°, 60°] or [-PI/3, PI/3] in radians */
    theta = clamp(theta + (state.isLookBack ? -1 : 1) * yh * thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new THREE.Quaternion()
    /* (0, 1, 0) is Up Vector / y positive Vector and rotate it by phi,
     *  so setFromAxisAngle uses following formula:
     *  q = cos(phi/2) + sin(phi/2) * ^n, where ^n is the normalized axis vector   */
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), phi)
    const qz = new THREE.Quaternion()
    /* (1, 0, 0) is Right Vector / x positive Vector and rotate it by theta */
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), theta)

    /* multiply both quaternions to apply both rotations around the
     * y-axis with angle phi and around the x-axis with angle theta */
    const quaternionRotationTotal = new THREE.Quaternion()
    quaternionRotationTotal.multiply(qx)
    quaternionRotationTotal.multiply(qz)

    rotation.copy(quaternionRotationTotal)
  }

  const getXRotation = () => {
    let xh = input.current.mouseXDelta / innerWidth

    if (state.input.keysMap.left || state.input.keysMap.right) {
      xh = state.input.keysMap.left ? -1.5 / innerWidth : 1.5 / innerWidth
    } else {
      xh = state.input.current.mouseXDelta / innerWidth
    }

    phi += -xh * phiSpeed
    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), phi)
    const q = new THREE.Quaternion()
    return q.multiply(qx)
  }

  const updateCamera = () => {
    state.camera.quaternion.copy(rotation)
    state.camera.position.copy(translation)

    const playerModelQuaternion = state.player.getRotation()
    const playerModelPosition = state.player.getPosition()

    state.player.setRotation(getXRotation())
    if (state.isLookBack) {
      state.camera.quaternion.copy(playerModelQuaternion)
      /* define distance to playerModel position 1 up 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      state.camera.position.copy(idealCameraPosition)
    } else {
      state.camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI))
      state.camera.position.copy(playerModelPosition)
      state.camera.position.y += 1.0
    }

    state.camera.position.y += Math.sin(headBobTimer * 10) * 0.025
  }

  const update = (timeElapsedInS: number) => {
    updateRotation()
    updateTranslation(timeElapsedInS)
    updateCamera()
    updateHeadBob(timeElapsedInS)
  }

  state.addEvent('renderer.update', (deltaInS: number) => {
    if (!state.isThirdPerson) {
      update(deltaInS)
    }
  })

  return fpsCamera
}