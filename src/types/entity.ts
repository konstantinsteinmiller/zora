import type { LEVELS } from '@/utils/enums.ts'
import Rapier from '@dimforge/rapier3d-compat'
import type { Mesh, Quaternion, Vector3 } from 'three'

export type Entity = Partial<EntityProps>

export interface ControllerAwarenessUtils {
  detectCriticalCharge: (entity: any) => boolean
}
export interface ControllerUtils {
  // [key: string]: () => void | any
  getPosition: () => Vector3
  getRotation: () => Quaternion
  setRotation: (rotation: Quaternion) => Quaternion
  isAnimState: (stateName: string) => boolean
}

export interface EntityProps {
  uuid: string
  mesh: Mesh
  name: string
  position: Vector3
  currentSpell: {
    name: string
    speed: number
    damage: number
    charge: number
  }
  stateMachine: any
  rigidBody: Rapier.RigidBody
  collider: Rapier.Collider
  hp: number
  previousHp: number
  maxHp: number
  mp: number
  previousMp: number
  maxMp: number
  endurance: number
  previousEndurance: number
  maxEndurance: number
  enduranceRegen: number
  colliderRadius: number
  halfHeight: number
  isAwaitingCoverCalculation: boolean
  lastCoverPosition: Vector3
  utils: {
    takeOffFrames: number
    groundedTime: {
      value: number
      lastTimeNotGrounded: number
    }
  }
  isGrounded: boolean
  appliedFlyImpulse: number
  center: Vector3
  path: Array<Vector3 | Waypoint>
  dealDamage: (entity: Entity, damage: number) => void
  calcHalfHeightPosition: (entity: Entity) => Vector3
  createOverHeadHealthBar?: (entity: Entity) => void
  isDead: (entity: Entity) => boolean
  die: (entity: Entity) => void
}

export interface Waypoint {
  x: number
  y: number
  z: number
  isPortal?: boolean
}

const guilds = ['guild-0', 'guild-1', 'guild-wild-fairy', 'GLD_NONE', 'GLD_FLF', 'GLD_CEL'] as const
export type Guild = (typeof guilds)[number]

// Now you have a reusable array:
export const guildList: Guild[] = [...guilds]
export type LevelType = (typeof LEVELS)[string]
