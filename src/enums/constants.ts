import { Color } from 'three'

export const baseStats: any = {
  hp: 100,
  previousHp: 100,
  maxHp: 100,
  mp: 100,
  previousMp: 100,
  maxMp: 100,
  endurance: 100,
  previousEndurance: 100,
  maxEndurance: 100,
  enduranceRegen: 1,
  currentSpell: {
    name: 'shot',
    speed: 1,
    damage: 25,
  },
  isGrounded: false,
  appliedFlyImpulse: 0,
  groundedTime: {
    value: 0,
    lastTimeNotGrounded: Date.now(),
  },
}

export const BASE_NAVIGATION_MOVE_SPEED = 3
export const LOOK_AROUND_SPEED = 1.5
export const FLY_IMPULSE = 0.2
export const MIN_FLY_IMPULSE = FLY_IMPULSE * 0.1
export const FLY_COST = 15
export const ENDURANCE_REGEN_SPEED = 5

export const characterAnimationNamesList: string[] = [
  'idle',
  'walk',
  'walk-back',
  'run',
  'run-back',
  'dance',
  'cast',
  'jump',
  'fly',
  'hit' /*
   */,
]

/* spell charge constants */
export const INITIAL_ROTATION_SPEED = Math.PI * 0.05 // 1 full rotation per 10 sec
export const MAX_ROTATION_SPEED = 4 * Math.PI // 2 full rotations per sec
export const MIN_CHARGE_SPEED = MAX_ROTATION_SPEED * 0.3
export const MIN_CHARGE_CRITICAL_SPEED = MAX_ROTATION_SPEED * 0.8
export const DEFAULT_CHARGE_DURATION = 12 /* in Seconds */
export const MIN_CHARGE_START_COLOR = new Color(0x77d9f9)
export const MIN_CHARGE_END_COLOR = new Color(0xff0000)
export const CRITICAL_CHARGE_START_COLOR = new Color(0xd4dcfc)
export const CRITICAL_CHARGE_END_COLOR = new Color(0x3d8dff)
