import { Vector3 } from 'three'

const baseDeceleration = new Vector3(-5.0, -0.0001, -5.0)
const baseAcceleration = new Vector3(1, 0.25, 15.0)

const addFrameDecceleration = (velocity: Vector3, deltaS: number) => {
  const frameDecceleration = new Vector3(
    velocity.x * baseDeceleration.x,
    velocity.y * baseDeceleration.y,
    velocity.z * baseDeceleration.z
  )
  frameDecceleration.multiplyScalar(deltaS)
  frameDecceleration.z =
    Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z))

  velocity.add(frameDecceleration)
}

export const createPlayerMovementStrategy = () => {
  const calculateVelocity = (velocity: Vector3, deltaS: number, controls: any) => {
    addFrameDecceleration(velocity, deltaS)

    const acc = baseAcceleration.clone()
    if (controls.sprint) {
      acc.multiplyScalar(2.0)
    }

    if (controls.forward) {
      velocity.z += acc.z * deltaS
    }
    if (controls.backward) {
      velocity.z -= acc.z * deltaS
    }
    const strafeVelocity = (controls.left ? 1 : 0) + (controls.right ? -1 : 0)
    velocity.x += 12 * acc.x * strafeVelocity * deltaS

    return velocity
  }

  return { calculateVelocity }
}

export const createEnemyMovementStrategy = () => {
  const calculateVelocity = (velocity: Vector3, deltaS: number) => {
    addFrameDecceleration(velocity, deltaS)
    return velocity
  }

  return { calculateVelocity }
}
