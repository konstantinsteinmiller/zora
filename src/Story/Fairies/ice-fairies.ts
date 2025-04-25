import { ARCTIC_BARRIER, FROST_NEEDLE, FROST_SHIELD, SNOWBALL_TOSS } from '@/Story/Spells/ice.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const ICE_YETI_YOUNG: FairyClass = {
  name: 'Yethog',
  id: 'ice_yeti_young',
  modelPath: '/models/yeti-young/yeti-young.fbx',
  description: 'A young ice yeti fairy, known for its playful nature and snowy fur.',
  element: ELEMENTS.ICE,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statsProgressionList: [],
  statsGrowthVisual: {
    hp: 5,
    defense: 4,
    speed: 1,
    special: 3,
  },
  stats: {
    name: 'Yethog',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  currentSpell: { ...SNOWBALL_TOSS },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

export const ICE_YETI_MIDDLE = {
  name: 'Yetopa',
  id: 'ice_yeti_middle',
  modelPath: '/models/yeti-middle/yeti-middle.fbx',
  description: 'An old ice yeti fairy, only encounterable in the highest mountain tops.',
  element: ELEMENTS.ICE,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statsProgressionList: [],
  statsGrowthVisual: {
    hp: 5,
    defense: 5,
    speed: 3,
    special: 5,
  },
  stats: {
    name: 'Yethog',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  currentSpell: { ...SNOWBALL_TOSS },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

export default [ICE_YETI_YOUNG, ICE_YETI_MIDDLE]
