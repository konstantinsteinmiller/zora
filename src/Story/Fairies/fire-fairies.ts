import { BLAZING_FEATHERS, BLINDING_FIRE, FIERY_EVADE, FIRE_BREEZE, SPARK } from '@/Story/Spells/fire.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'
import { ref } from 'vue'

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
    hp: calcStatGrowth(200, 1),
    power: calcStatGrowth(0.35, 1),
    defense: calcStatGrowth(8, 1),
    speed: calcStatGrowth(1, 1),
    special: calcStatGrowth(0.75, 1),
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

const dragir = ref(null)
const dragorin = ref(null)
const dragoire = ref(null)
export const FIRE_DRAGON_YOUNG = {
  name: 'Dragir',
  id: 'fire_dragon_young',
  modelPath: '/models/dragon-young/dragon-young.fbx',
  description: 'A young fire dragon fairy. Its weak but willing to learn.',
  element: ELEMENTS.FIRE,
  tier: 0,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(200, 0),
    power: calcStatGrowth(0.5, 0),
    defense: calcStatGrowth(14, 0),
    speed: calcStatGrowth(0.35, 0),
    special: calcStatGrowth(0.35, 0),
  },
  evolutionsList: [null, dragorin],
  statsGrowthVisual: {
    hp: 5,
    defense: 3,
    speed: 2,
    special: 4,
  },
  stats: {
    name: 'Dragir',
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
dragir.value = FIRE_DRAGON_YOUNG

export const FIRE_DRAGON_MIDDLE = {
  name: 'Dragorin',
  id: 'fire_dragon_middle',
  modelPath: '/models/dragon-middle/dragon-middle.fbx',
  description: "An adult fire dragon fairy. The power grows with it's flame on his tail.",
  element: ELEMENTS.FIRE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(260, 1),
    power: calcStatGrowth(0.75, 1),
    defense: calcStatGrowth(18, 1),
    speed: calcStatGrowth(0.25, 1),
    special: calcStatGrowth(0.5, 1),
  },
  evolutionsList: [dragir, dragoire],
  statsGrowthVisual: {
    hp: 4,
    defense: 5,
    speed: 1,
    special: 2,
  },
  stats: {
    name: 'Dragorin',
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
dragorin.value = FIRE_DRAGON_MIDDLE

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
  evolutionsList: [dragorin, null],
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
dragoire.value = FIRE_DRAGON_OLD

export default [FIRE_HARPY, FIRE_DRAGON_YOUNG, FIRE_DRAGON_MIDDLE, FIRE_DRAGON_OLD]
