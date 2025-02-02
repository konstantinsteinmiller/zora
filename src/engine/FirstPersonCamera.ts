import * as THREE from 'three'
import { clamp } from '@/utils/function.ts'
import { Vector3 } from 'three'

export default class FirstPersonCamera {
  player: any = null
  constructor(player: any) {
    this.camera = camera
    this.input = player.inputController
    this.player = player
    this.rotation = new THREE.Quaternion()
    this.translation = new THREE.Vector3(0, 2, 0)
    this.phi = 0
    this.theta = 0
    this.phiSpeed = 8
    this.thetaSpeed = 5
    this.headBobActive = false
    this.headBobTimer = 0
  }

  update(timeElapsedInS: number) {
    this.updateRotation(timeElapsedInS)
    this.updateTranslation(timeElapsedInS)
    this.updateCamera(timeElapsedInS)
    this.updateHeadBob(timeElapsedInS)
    this.input.update(timeElapsedInS)
  }

  updateHeadBob(timeElapsedInS: number) {
    if (this.headBobActive) {
      const wavelength = Math.PI
      const nextStep = 1 + Math.floor(((this.headBobTimer + 0.000001) * 10) / wavelength)
      const nextStepTime = (nextStep * wavelength) / 10
      this.headBobTimer = Math.min(this.headBobTimer + timeElapsedInS, nextStepTime)

      if (this.headBobTimer == nextStepTime) {
        this.headBobActive = false
      }
    }
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

    if (forwardVelocity !== 0 || strafeVelocity !== 0) {
      this.headBobActive = true
    }
  }

  updateRotation(timeElapsedInS: number) {
    /* calc the delta to rotate the character vertically */
    const xh = this.input.current.mouseXDelta / innerWidth

    /* calc the delta to rotate the character horizontally */
    const yh = this.input.current.mouseYDelta / innerHeight

    /* apply some speed constant to get an angle in radians [0, 2 PI] */
    this.phi += -xh * this.phiSpeed
    /* apply some speed constant to get an angle in radians [0, 2 PI],
     * but don't allow user to rotate too far up or too far down
     * -> [-60°, 60°] or [-PI/3, PI/3] in radians */
    this.theta = clamp(this.theta + (this.isLookBack ? -1 : 1) * yh * this.thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new THREE.Quaternion()
    /* (0, 1, 0) is Up Vector / y positive Vector and rotate it by phi,
     *  so setFromAxisAngle uses following formula:
     *  q = cos(phi/2) + sin(phi/2) * ^n, where ^n is the normalized axis vector   */
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
    const qz = new THREE.Quaternion()
    /* (1, 0, 0) is Right Vector / x positive Vector and rotate it by theta */
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

    /* multiply both quaternions to apply both rotations around the
     * y-axis with angle phi and around the x-axis with angle theta */
    const quaternionRotationTotal = new THREE.Quaternion()
    quaternionRotationTotal.multiply(qx)
    quaternionRotationTotal.multiply(qz)

    this.rotation.copy(quaternionRotationTotal)
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

  updateCamera(timeElapsedInS: number) {
    camera.quaternion.copy(this.rotation)
    camera.position.copy(this.translation)

    const playerModelQuaternion = this.player.getRotation
    const playerModelPosition = this.player.getPosition

    this.player.setRotation(this.getXRotation())
    if (window.isLookBack) {
      camera.quaternion.copy(playerModelQuaternion)
      /* define distance to playerModel position 1 up 2 away */
      const idealCameraPosition: Vector3 = new Vector3(0, 1, 2)
      idealCameraPosition.applyQuaternion(playerModelQuaternion)
      idealCameraPosition.add(playerModelPosition)
      camera.position.copy(idealCameraPosition)
    } else {
      camera.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI))
      camera.position.copy(playerModelPosition)
      camera.position.y += 1.0
    }

    camera.position.y += Math.sin(this.headBobTimer * 10) * 0.025
  }
}
