import * as THREE from 'three'
import { Vector3 } from 'three'
import { clamp } from '@/utils/function.ts'

export default class ThirdPersonCamera {
  constructor({ player }: { player: any }) {
    this.player = player
    // this.camera.position.copy(this.target)
    this.currentPosition = new THREE.Vector3()
    this.currentLookAt = new THREE.Vector3()
    this.input = player.inputController
    this.rotation = new THREE.Quaternion()
    this.translation = new THREE.Vector3(0, 1, 0)
    this.phi = 0
    this.theta = 0
    this.phiSpeed = 8
    this.thetaSpeed = 5
  }

  update(elapsedTimeInS: number) {
    this.updateRotation()
    this.updateTranslation(elapsedTimeInS)
    this.updateCamera()
    this.input.update(elapsedTimeInS)
    // const idealOffset = this.calculateIdealOffset()
    // const idealLookAt = this.calculateIdealLookAt()
    //
    // // const t = 0.15
    // // const t = 4.0 * elapsedTimeInMs
    // const t = 1.0 - Math.pow(0.001, elapsedTimeInS)
    //
    // this.currentPosition.lerp(idealOffset, t)
    // this.currentLookAt.lerp(idealLookAt, t)
    //
    // camera.position.copy(this.currentPosition)
    // camera.lookAt(this.currentLookAt)
  }

  updateCamera() {
    camera.quaternion.copy(this.rotation)
    camera.position.copy(this.translation)

    const playerModelQuaternion = this.player.getRotation
    const playerModelPosition = this.player.getPosition

    this.player.setRotation(this.getXRotation())
    if (window.isLookBack) {
      camera.quaternion.copy(playerModelQuaternion)
      /* define distance to playerModel position 1 up and 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      camera.position.copy(idealCameraPosition)
    } else {
      camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI))
      const idealCameraOffset = new Vector3(-1, 2, -3.5)
      idealCameraOffset.applyQuaternion(playerModelQuaternion)
      idealCameraOffset.add(playerModelPosition)
      camera.position.copy(idealCameraOffset)
    }
  }

  getXRotation() {
    let xh = this.input.current.mouseXDelta / innerWidth

    if (this.input.keysMap.left || this.input.keysMap.right) {
      xh = this.input.keysMap.left ? -1.5 / innerWidth : 1.5 / innerWidth
    } else {
      xh = this.input.current.mouseXDelta / innerWidth
    }

    this.phi += -xh * this.phiSpeed
    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
    const q = new THREE.Quaternion()
    return q.multiply(qx)
  }

  updateTranslation(timeElapsedInS: number) {
    const forwardVelocity = (this.input.keysMap.forward ? 1 : 0) + (this.input.keysMap.backward ? -1 : 0)
    const strafeVelocity = (this.input.keysMap.left ? 1 : 0) + (this.input.keysMap.right ? -1 : 0)

    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)

    const forward = new THREE.Vector3(0, 0, -1)
    forward.applyQuaternion(qx)
    // console.log('timeElapsedInS: ', timeElapsedInS)
    forward.multiplyScalar(forwardVelocity * timeElapsedInS * 2)

    const left = new THREE.Vector3(-1, 0, 0)
    left.applyQuaternion(qx)
    left.multiplyScalar(strafeVelocity * timeElapsedInS * 2)

    this.translation.add(forward)
    this.translation.add(left)
  }

  updateRotation() {
    const xh = this.input.current.mouseXDelta / innerWidth
    const yh = this.input.current.mouseYDelta / innerHeight

    this.phi += -xh * this.phiSpeed
    this.theta = clamp(this.theta + (this.isLookBack ? -1 : 1) * yh * this.thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
    const qz = new THREE.Quaternion()
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

    const q = new THREE.Quaternion()
    q.multiply(qx)
    q.multiply(qz)

    this.rotation.copy(q)
  }

  calculateIdealOffset() {
    const idealTarget: Vector3 = new Vector3(-1, 1, -2.5)
    idealTarget.applyQuaternion(this.player.getRotation)
    idealTarget.add(this.player.getPosition)
    return idealTarget
  }

  calculateIdealLookAt() {
    const idealTarget: Vector3 = new Vector3(0, 4, 50)
    idealTarget.applyQuaternion(this.player.getRotation)
    idealTarget.add(this.player.getPosition)
    return idealTarget
  }
}
