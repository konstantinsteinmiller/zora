import * as THREE from 'three'
import { Vector3 } from 'three'

export default class ThirdPersonCamera {
  constructor({ target }: { target: any }) {
    this.target = target
    // this.camera.position.copy(this.target)
    this.currentPosition = new THREE.Vector3()
    this.currentLookAt = new THREE.Vector3()
  }

  update(/*elapsedTimeInMs: number*/) {
    const idealOffset = this.calculateIdealOffset()
    const idealLookAt = this.calculateIdealLookAt()

    const t = 0.15
    // const t = 4.0 * elapsedTimeInMs
    // const t = 1.0 - Math.pow(0.001, elapsedTimeInMs)

    this.currentPosition.lerp(idealOffset, t)
    this.currentLookAt.lerp(idealLookAt, t)

    camera.position.copy(this.currentPosition)
    camera.lookAt(this.currentLookAt)
  }

  calculateIdealOffset() {
    const idealTarget: Vector3 = new Vector3(-1, 2, -4)
    idealTarget.applyQuaternion(this.target.getRotation)
    idealTarget.add(this.target.getPosition)
    return idealTarget
  }

  calculateIdealLookAt() {
    const idealTarget: Vector3 = new Vector3(0, 4, 50)
    idealTarget.applyQuaternion(this.target.getRotation)
    idealTarget.add(this.target.getPosition)
    return idealTarget
  }
}
