import { BLAZING_FEATHERS, BLINDING_FIRE, FIERY_EVADE, FIRE_BREEZE, FLASH, SPARK } from '@/Story/Spells/fire.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { getStatGrowth } from '@/utils/fairy.ts'
import { ref } from 'vue'

const FIRE_HARPY_GROWTH_STEPS = {
  hp: 0,
  power: 1,
  defense: -1,
  speed: 1,
  special: 0,
}
export const FIRE_HARPY: Fairy = {
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
  evolutionsList: [null, null],
  statGrowthPerLevel: getStatGrowth(FIRE_HARPY_GROWTH_STEPS, 0),
  statsGrowthSteps: FIRE_HARPY_GROWTH_STEPS,
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

const DRAGON_YOUNG_GROWTH_STEPS = {
  hp: -1,
  power: 2,
  defense: 0,
  speed: -1,
  special: 1,
}
export const FIRE_DRAGON_YOUNG: Fairy = {
  name: 'Dragir',
  id: 'fire_dragon_young',
  modelPath: '/models/dragon-young/dragon-young.fbx',
  description: 'A young fire dragon fairy. Its weak but willing to learn.',
  element: ELEMENTS.FIRE,
  tier: 0,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [null, dragorin],
  statGrowthPerLevel: getStatGrowth(DRAGON_YOUNG_GROWTH_STEPS, 0),
  statsGrowthSteps: DRAGON_YOUNG_GROWTH_STEPS,
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
  spells: [SPARK, FIRE_BREEZE],
  passiveSpells: [BLINDING_FIRE, FLASH],
}
dragir.value = FIRE_DRAGON_YOUNG

const DRAGON_MIDDLE_GROWTH_STEPS = {
  hp: 2,
  power: 2,
  defense: 2,
  speed: -3,
  special: -1,
}
export const FIRE_DRAGON_MIDDLE: Fairy = {
  name: 'Dragorin',
  id: 'fire_dragon_middle',
  modelPath: '/models/dragon-middle/dragon-middle.fbx',
  description: "An adult fire dragon fairy. The power grows with it's flame on his tail.",
  element: ELEMENTS.FIRE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: getStatGrowth(DRAGON_MIDDLE_GROWTH_STEPS, 1),
  evolutionsList: [dragir, dragoire],
  statsGrowthSteps: DRAGON_MIDDLE_GROWTH_STEPS,
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
  passiveSpells: [BLINDING_FIRE, FLASH],
}
dragorin.value = FIRE_DRAGON_MIDDLE

const DRAGON_OLD_GROWTH_STEPS = {
  hp: 4,
  power: 2,
  defense: 2,
  speed: -3,
  special: -2,
}
export const FIRE_DRAGON_OLD: Fairy = {
  name: 'Dragoire',
  id: 'fire_dragon_old',
  modelPath: '/models/dragon-old/dragon-old.fbx',
  description: 'An elderly fire dragon fairy. The power of this fire creature is unparalleled.',
  element: ELEMENTS.FIRE,
  tier: 2,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [dragorin, null],
  statGrowthPerLevel: getStatGrowth(DRAGON_OLD_GROWTH_STEPS, 2),
  statsGrowthSteps: DRAGON_OLD_GROWTH_STEPS,
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
  passiveSpells: [BLINDING_FIRE, FLASH],
}
dragoire.value = FIRE_DRAGON_OLD

export default [FIRE_HARPY, FIRE_DRAGON_YOUNG, FIRE_DRAGON_MIDDLE, FIRE_DRAGON_OLD]
