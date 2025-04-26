import type { ENUM } from '@/types'

export const TUTORIALS: ENUM = {
  CHARACTER_CONTROLS: 'characterControl',
  MISSING_MANA: 'missingMana',
  OVERCHARGED: 'overcharged',
}
export const LEVELS: ENUM = {
  ARENA: 'arena',
  WORLD: 'world',
  FAIRY: 'fairy',
}
export const INTERACTIONS: ENUM = {
  TALK: 'talk-interaction',
  READ: 'read-interaction',
  NAME: 'name-interaction',
  DISPEL: 'dispel-interaction',
}
export const ELEMENTS: ENUM = {
  NATURE: 'nature',
  AIR: 'air',
  WATER: 'water',
  LIGHT: 'light',
  ENERGY: 'energy',
  PSI: 'psi',
  EARTH: 'earth',
  ICE: 'ice',
  FIRE: 'fire',
  DARK: 'dark',
  METAL: 'metal',
  NEUTRAL: 'neutral',
}
export type Element = (typeof ELEMENTS)[keyof typeof ELEMENTS]

export const MENU: ENUM = {
  MAP: 'map',
  COLLECTION: 'collection',
  ITEMS: 'items',
  FAIRY: 'fairy',
  ATTACK_SPELLS: 'attackSpells',
  PASSIVE_SPELLS: 'passiveSpells',
}
export type MenuItem = (typeof MENU)[keyof typeof MENU]

export const tierScaleMap: Record<number, number> = {
  0: 1,
  1: 1.2,
  2: 1.4,
}

export const LANGUAGES: Array<string> = [
  // 'ar',
  // 'cs',
  // 'da',
  'de',
  // 'el',
  'en',
  // 'es',
  // 'fi',
  // 'fr',
  // 'it',
  // 'jp',
  // 'kr',
  // 'ms',
  // 'nl',
  // 'pl',
  // 'pt',
  // 'ru',
  // 'sv',
  // 'zh',
]
