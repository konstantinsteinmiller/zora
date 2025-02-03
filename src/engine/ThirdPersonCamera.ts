import state from '@/states/GlobalState.ts'
import * as THREE from 'three'
import { Vector3 } from 'three'
import { clamp } from '@/utils/function.ts'

let thirdPersonCamera: any = null
export default () => {
  /* thirdPersonCamera is a Singleton */
  if (thirdPersonCamera !== null) {
    return thirdPersonCamera
  }

  let rotation = new THREE.Quaternion()
  let translation = new THREE.Vector3(0, 1, 0)
  let phi = 0
  let theta = 0
  const  phiSpeed = 8
  const thetaSpeed = 5

  const updateCamera = () => {
    state.camera.quaternion.copy(rotation)
    state.camera.position.copy(translation)

    const playerModelQuaternion = state.player.getRotation()
    const playerModelPosition = state.player.getPosition()

    state.player.setRotation(getXRotation())
    if (state.isLookBack) {
      state.camera.quaternion.copy(playerModelQuaternion)
      /* define distance to playerModel position 1 up and 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      state.camera.position.copy(idealCameraPosition)
    } else {
      state.camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI))
      const idealCameraOffset = new Vector3(-1, 2, -3.5)
      idealCameraOffset.applyQuaternion(playerModelQuaternion)
      idealCameraOffset.add(playerModelPosition)
      state.camera.position.copy(idealCameraOffset)
    }
  }

  const getXRotation = () =>  {
    let xh = state.input.current.mouseXDelta / innerWidth

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

  const updateTranslation =(timeElapsedInS: number) =>  {
    const forwardVelocity = (state.input.keysMap.forward ? 1 : 0) + (state.input.keysMap.backward ? -1 : 0)
    const strafeVelocity = (state.input.keysMap.left ? 1 : 0) + (state.input.keysMap.right ? -1 : 0)

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
  }

  const updateRotation = ()  =>  {
    const xh = state.input.current.mouseXDelta / innerWidth
    const yh = state.input.current.mouseYDelta / innerHeight

    phi += -xh * phiSpeed
    theta = clamp(theta + (state.isLookBack ? -1 : 1) * yh * thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), phi)
    const qz = new THREE.Quaternion()
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), theta)

    const q = new THREE.Quaternion()
    q.multiply(qx)
    q.multiply(qz)

    rotation.copy(q)
  }

  const update = (elapsedTimeInS: number) => {
    updateRotation()
    updateTranslation(elapsedTimeInS)
    updateCamera()
  }

  state.addEvent('renderer.update', (deltaInS: number) => {
    if (state.isThirdPerson) {
      update(deltaInS)
    }
  })

  state.thirdPersonCamera = thirdPersonCamera
  return thirdPersonCamera
}
