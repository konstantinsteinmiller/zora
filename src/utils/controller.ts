import { ENDURANCE_REGEN_SPEED, FLY_COST, FLY_IMPULSE } from '@/enums/constants.ts'
import { clamp } from 'three/src/math/MathUtils'
import * as THREE from 'three'
import { Vector3 } from 'three'

export const controllerUtils = () => ({
  getPosition(): Vector3 {
    if (!this.mesh) {
      return new Vector3(0, 0, 0)
    }
    return this.mesh?.position
  },
  getRotation() {
    return this.mesh.quaternion
  },
  setRotation(rotation: THREE.Quaternion) {
    if (!this.mesh) {
      return
    }
    const prevQuat = this.mesh.quaternion.clone()
    prevQuat.slerp(rotation, 0.2) // Smooth interpolation
    this.rigidBody.setRotation(prevQuat)
    return this.mesh.quaternion.copy(prevQuat)
  },
})

export const controllerFunctions = () => {
  let didDamage = false
  const TIME_INTERVAL = 6

  return {
    dealDamage(target: any, damage: number) {
      target.previousHp = target.hp
      target.hp = clamp(target.hp - damage, 0, target.maxHp)
    },
    dealMpDamage(target: any, damage: number) {
      target.previousMp = target.mp
      target.mp = clamp(target.mp - damage, 0, target.maxMp)
    },
    dealEnduranceDamage(target: any, damage: number) {
      target.previousEndurance = target.endurance
      target.endurance = clamp(target.endurance - damage, 0, target.maxEndurance)
    },
    addHp(target: any, heal: number) {
      target.previousHp = target.hp
      target.hp = clamp(target.hp + heal, 0, target.maxHp)
    },
    updateLife(target: any, elapsedTimeInS: number) {
      if (!didDamage && elapsedTimeInS % TIME_INTERVAL < 1.0) {
        this.dealDamage(target, -23)
        this.dealMpDamage(target, 12)
        didDamage = true
      } else if (didDamage && elapsedTimeInS % TIME_INTERVAL > TIME_INTERVAL - 1.0) {
        didDamage = false
      }
    },
    updateEndurance(target: any, deltaS: number) {
      if (target.stateMachine.currentState.name !== 'fly' && target.groundedTime.value > 0.5) {
        this.dealEnduranceDamage(target, -ENDURANCE_REGEN_SPEED * target.enduranceRegen * deltaS)
      }
    },
  }
}
