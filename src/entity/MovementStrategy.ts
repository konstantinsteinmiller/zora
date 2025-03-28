import $ from '@/global'
import { Vector3 } from 'three'

const baseDeceleration = new Vector3(-5.0, -0.0001, -5.0)
const baseAcceleration = new Vector3(1, 0.25, 15.0)

const addFrameDeceleration = (velocity: Vector3, deltaS: number) => {
  const frameDeceleration = new Vector3(
    velocity.x * baseDeceleration.x,
    velocity.y * baseDeceleration.y,
    velocity.z * baseDeceleration.z
  )
  frameDeceleration.multiplyScalar(deltaS)
  frameDeceleration.z = Math.sign(frameDeceleration.z) * Math.min(Math.abs(frameDeceleration.z), Math.abs(velocity.z))

  velocity.add(frameDeceleration)
}

export const createPlayerMovementStrategy = () => {
  const calculateVelocity = (entity: any, deltaS: number, controls: any) => {
    addFrameDeceleration(entity.currentVelocity, deltaS)

    const acc = baseAcceleration.clone()
    if (controls.sprint) {
      acc.multiplyScalar(2.0)
    }

    const stopStates = ['cast', 'hit']
    if (stopStates.includes(entity.stateMachine.currentState.name)) {
      acc.multiplyScalar(0.0)
    }

    if (entity.stateMachine.currentState.name === 'jump' && !$.controls.sprint) {
      acc.multiplyScalar(1.5)
    }

    if (controls.forward) {
      entity.currentVelocity.z += acc.z * deltaS
    }
    if (controls.backward) {
      entity.currentVelocity.z -= acc.z * deltaS
    }
    const strafeVelocity = (controls.left ? 1 : 0) + (controls.right ? -1 : 0)
    entity.currentVelocity.x += 12 * acc.x * strafeVelocity * deltaS

    return entity.currentVelocity
  }

  return { calculateVelocity }
}

export const createEnemyMovementStrategy = () => {
  const calculateVelocity = (velocity: Vector3, deltaS: number) => {
    addFrameDeceleration(velocity, deltaS)
    return velocity
  }

  return { calculateVelocity }
}
