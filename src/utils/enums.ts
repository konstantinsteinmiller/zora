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

export const levelXpMap: Record<string, number> = {
  '1': 0,
  '2': 3,
  '3': 9,
  '4': 18,
  '5': 30,
  '6': 45,
  '7': 63,
  '8': 84,
  '9': 108,
  '10': 135,
  '11': 165,
  '12': 198,
  '13': 234,
  '14': 273,
  '15': 315,
  '16': 360,
  '17': 408,
  '18': 459,
  '19': 513,
  '20': 570,
  '21': 630,
  '22': 693,
  '23': 759,
  '24': 828,
  '25': 900,
  '26': 975,
  '27': 1053,
  '28': 1134,
  '29': 1218,
  '30': 1305,
  '31': 1395,
  '32': 1488,
  '33': 1584,
  '34': 1683,
  '35': 1785,
  '36': 1890,
  '37': 1998,
  '38': 2109,
  '39': 2223,
  '40': 2340,
  '41': 2460,
  '42': 2583,
  '43': 2709,
  '44': 2838,
  '45': 2970,
  '46': 3105,
  '47': 3243,
  '48': 3384,
  '49': 3528,
  '50': 3675,
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
