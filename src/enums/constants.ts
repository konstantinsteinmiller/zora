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
export const FLY_IMPULSE = 0.1
export const MIN_FLY_IMPULSE = 0.01
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
