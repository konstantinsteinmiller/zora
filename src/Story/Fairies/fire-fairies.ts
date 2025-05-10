import { BLAZING_FEATHERS, BLINDING_FIRE, FIERY_EVADE, FIRE_BREEZE, FLASH, SPARK } from '@/Story/Spells/fire.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { ref } from 'vue'

export const FIRE_HARPY: Fairy = {
  name: 'Harpire',
  id: 'fire_harpy',
  modelPath: '/models/fire-harpy/fire-harpy.fbx',
  description:
    'A fire fairy using air and fire attacks. this mythical creature spends a lot of time on branches of threes and the walls of castles.',
  element: ELEMENTS.FIRE,
  tier: 0,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 0, power: 1, defense: -1, speed: 1, special: 0 },
  spells: [BLAZING_FEATHERS, FIRE_BREEZE],
  passiveSpells: [BLINDING_FIRE, FIERY_EVADE],
}

const dragir = ref(null)
const dragorin = ref(null)
const dragoire = ref(null)

export const FIRE_DRAGON_YOUNG: Fairy = {
  name: 'Dragir',
  id: 'fire_dragon_young',
  modelPath: '/models/dragon-young/dragon-young.fbx',
  description: 'A young fire dragon fairy. Its weak but willing to learn.',
  element: ELEMENTS.FIRE,
  tier: 0,
  evolutionsList: [null, dragorin],
  statsGrowthSteps: { hp: -1, power: 2, defense: 0, speed: -1, special: 1 },
  spells: [SPARK, FIRE_BREEZE],
  passiveSpells: [BLINDING_FIRE, FLASH],
}
dragir.value = FIRE_DRAGON_YOUNG

export const FIRE_DRAGON_MIDDLE: Fairy = {
  name: 'Dragorin',
  id: 'fire_dragon_middle',
  modelPath: '/models/dragon-middle/dragon-middle.fbx',
  description: "An adult fire dragon fairy. The power grows with it's flame on his tail.",
  element: ELEMENTS.FIRE,
  tier: 1,
  evolutionsList: [dragir, dragoire],
  statsGrowthSteps: { hp: 2, power: 2, defense: 2, speed: -3, special: -1 },
  spells: [SPARK],
  passiveSpells: [BLINDING_FIRE, FLASH],
}
dragorin.value = FIRE_DRAGON_MIDDLE

export const FIRE_DRAGON_OLD: Fairy = {
  name: 'Dragoire',
  id: 'fire_dragon_old',
  modelPath: '/models/dragon-old/dragon-old.fbx',
  description: 'An elderly fire dragon fairy. The power of this fire creature is unparalleled.',
  element: ELEMENTS.FIRE,
  tier: 2,
  evolutionsList: [dragorin, null],
  statsGrowthSteps: { hp: 4, power: 2, defense: 2, speed: -3, special: -2 },
  spells: [SPARK],
  passiveSpells: [BLINDING_FIRE, FLASH],
}
dragoire.value = FIRE_DRAGON_OLD

export default [FIRE_HARPY, FIRE_DRAGON_YOUNG, FIRE_DRAGON_MIDDLE, FIRE_DRAGON_OLD]
