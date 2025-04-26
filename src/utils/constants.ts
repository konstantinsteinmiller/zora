import { Color } from 'three'
import { ref } from 'vue'

export const IS_ZORA = true
export const BASE_NAVIGATION_MOVE_SPEED = 3
export const LOOK_AROUND_SPEED = 1.5
export const MAX_FLY_IMPULSE = 0.2
export const MIN_FLY_IMPULSE = MAX_FLY_IMPULSE * 0.1
export const FLY_COST = 15
export const ENDURANCE_REGEN_SPEED = 10
export const MP_REGEN_SPEED = 0.5
export const BASE_DIALOG_DURATION = 1500
export const dialogTextSpeed = ref(60) // 60 ms per letter, adjustable in options

export type ANIM = 'idle' | 'walk' | 'walk-back' | 'run' | 'run-back' | 'dance' | 'cast' | 'jump' | 'fly' | 'hit'
export const characterAnimationNamesList: ANIM[] = [
  'idle',
  'walk',
  'walk-back',
  'run',
  'run-back',
  // 'dance',
  // 'cast',
  'jump',
  'fly',
  'hit' /*
   */,
]
export const worldCharacterAnimationNamesList: ANIM[] = characterAnimationNamesList.filter(
  (anim: string) => !['fly', 'cast'].includes(anim)
)
export const worldNPCAnimationNamesList: ANIM[] = ['idle', 'walk', 'run']
export const fairyAnimsList: ANIM[] = ['idle', 'fly']

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
export const STRAFE_ROT_VELOCITY = 8
export const ZORA_TOTAL_LOAD_SIZE_NAME = 'zora_total_load_size'

export const Options = {
  unadjustedMovement: true,
}

export const GAME_USER_LANGUAGE: string = 'zoraUserLanguage'
export const GAME_USER_SOUND_VOLUME: string = 'zoraSoundVolume'
export const GAME_USER_MUSIC_VOLUME: string = 'zoraMusicVolume'
export const GAME_USER_TUTORIAL_DONE_MAP: string = 'zoraTutorialDoneMap'

// Define collision groups (using bitmasks)
export const WORLD_GROUP = 0b0001 // Group 1 for world objects
export const FAIRY_DUST_GROUP = 0b0010 // Group 2 for fairy dust
export const OTHER_GROUP = 0b0100 // Group 3 for other objects
export const CHARACTER_GROUP = 0b1000 // Group 4 for characters
