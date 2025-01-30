import InputController from '@/control/InputController.ts'
import * as THREE from 'three'
import { clamp } from '@/utils/function.ts'

export default class FirstPersonCamera {
  constructor(input: any, player: any) {
    this.camera = camera
    this.input = input
    this.player = player
    this.rotation = new THREE.Quaternion()
    this.translation = new THREE.Vector3(0, 2, 0)
    this.phi = 0
    this.theta = 0
    this.phiSpeed = 8 /* / 100*/
    this.thetaSpeed = 5 /* / 100*/
    this.headBobActive = false
    this.headBobTimer = 0
  }

  update(timeElapsedInS: number) {
    this.updateRotation(timeElapsedInS)
    this.updateCamera(timeElapsedInS)
    this.updateTranslation(timeElapsedInS)
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
    const xh = this.input.current.mouseXDelta / innerWidth
    const yh = this.input.current.mouseYDelta / innerHeight

    this.phi += -xh * this.phiSpeed
    this.theta = clamp(this.theta + -yh * this.thetaSpeed, -Math.PI / 3, Math.PI / 3)

    const qx = new THREE.Quaternion()
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
    const qz = new THREE.Quaternion()
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

    const q = new THREE.Quaternion()
    // q.multiplyQuaternions(qz, qx)
    q.multiply(qx)
    q.multiply(qz)

    this.rotation.copy(q)
  }

  updateCamera(timeElapsedInS: number) {
    camera.quaternion.copy(this.rotation)
    camera.position.copy(this.translation)

    camera.position.y += Math.sin(this.headBobTimer * 10) * 0.025

    const forward = new THREE.Vector3(0, 0, -1)
    forward.applyQuaternion(this.rotation)

    const dir = forward.clone()

    forward.multiplyScalar(100)
    forward.add(this.translation)

    let closest = forward
    const result = new THREE.Vector3()
    const ray = new THREE.Ray(this.translation, dir)
    if (this.objects?.length === 0) {
      for (let i = 0; i < this.objects.length; ++i) {
        if (ray.intersectBox(this.objects[i], result)) {
          if (result.distanceTo(ray.origin) < closest.distanceTo(ray.origin)) {
            closest = result.clone()
          }
        }
      }

      this.camera.lookAt(closest)
    }
  }
}
