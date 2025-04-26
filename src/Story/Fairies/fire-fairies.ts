import { BLAZING_FEATHERS, BLINDING_FIRE, FIERY_EVADE, FIRE_BREEZE, SPARK } from '@/Story/Spells/fire.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'

export const FIRE_HARPY = {
  name: 'Harpire',
  id: 'fire_harpy',
  modelPath: '/models/fire-harpy/fire-harpy.fbx',
  description:
    'A fire fairy using air and fire attacks. this mythical creature spends a lot of time on branches of threes and the walls of castles.',
  element: ELEMENTS.FIRE,
  tier: 0,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(180, 0),
    power: calcStatGrowth(0.35, 0),
    defense: calcStatGrowth(8, 0),
    speed: calcStatGrowth(1, 0),
    special: calcStatGrowth(0.75, 0),
  },
  statsGrowthVisual: {
    hp: 4,
    defense: 1,
    speed: 5,
    special: 5,
  },
  stats: {
    name: 'Harpire',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [BLAZING_FEATHERS, FIRE_BREEZE],
  passiveSpells: [BLINDING_FIRE, FIERY_EVADE],
}
export const FIRE_DRAGON_OLD = {
  name: 'Dragoire',
  id: 'fire_dragon_old',
  modelPath: '/models/dragon-old/dragon-old.fbx',
  description: 'An elderly fire dragon fairy. The power of this fire creature is unparalleled.',
  element: ELEMENTS.FIRE,
  tier: 2,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(340, 2),
    power: calcStatGrowth(1, 2),
    defense: calcStatGrowth(24, 2),
    speed: calcStatGrowth(0.25, 2),
    special: calcStatGrowth(0.5, 2),
  },
  statsGrowthVisual: {
    hp: 5,
    defense: 3,
    speed: 2,
    special: 4,
  },
  stats: {
    name: 'Dragoire',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [SPARK],
  passiveSpells: [],
}

export default [FIRE_HARPY, FIRE_DRAGON_OLD]
