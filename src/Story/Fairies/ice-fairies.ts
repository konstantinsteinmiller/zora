import { ARCTIC_BARRIER, CHILLING_STRIKE, FROST_NEEDLE, FROST_SHIELD, SNOWBALL_TOSS } from '@/Story/Spells/ice.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { type Ref, ref } from 'vue'

const Yetopa: Ref<Fairy | null> = ref(null)

export const ICE_YETI_YOUNG: Fairy = {
  name: 'Yethog',
  id: 'ice_yeti_young',
  modelPath: '/models/yeti-young/yeti-young.fbx',
  description: 'A young ice yeti fairy, known for its playful nature and snowy fur.',
  element: ELEMENTS.ICE,
  tier: 0,
  evolutionsList: [null, Yetopa],
  statsGrowthSteps: {
    hp: 2,
    power: -1,
    defense: 1,
    speed: -1,
    special: 0,
  },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

export const ICE_YETI_MIDDLE: Fairy = {
  name: 'Yetopa',
  id: 'ice_yeti_middle',
  modelPath: '/models/yeti-middle/yeti-middle.fbx',
  description: 'An old ice yeti fairy, only encounterable in the highest mountain tops.',
  element: ELEMENTS.ICE,
  tier: 1,
  evolutionsList: [ICE_YETI_YOUNG, null],
  statsGrowthSteps: {
    hp: 3,
    power: 0,
    defense: 3,
    speed: -3,
    special: -1,
  },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}
Yetopa.value = ICE_YETI_MIDDLE

const Snogrin = ref(null)
const Snokong = ref(null)
export const ICE_SNOWMAN_YOUNG: Fairy = {
  name: 'Snowy',
  id: 'ice_snowman_young',
  modelPath: '/models/snowman-young/snowman-young.fbx',
  description:
    'A young ice fairy that seems like a come to live version of a childish winter project. A cute little snowman-young.',
  element: ELEMENTS.ICE,
  tier: 0,
  evolutionsList: [null, Snogrin],
  statsGrowthSteps: {
    hp: 0,
    power: 2,
    defense: -1,
    speed: 1,
    special: -1,
  },
  spells: [CHILLING_STRIKE, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

export const ICE_SNOWMAN_MIDDLE: Fairy = {
  name: 'Snogrin',
  id: 'ice_snowman_middle',
  modelPath: '/models/snowman-middle/snowman-middle.fbx',
  description: 'A ice fairy that seems like a come to live version of a childish winter project.',
  element: ELEMENTS.ICE,
  tier: 1,
  evolutionsList: [ICE_SNOWMAN_YOUNG, Snokong],
  statsGrowthSteps: {
    hp: 0,
    power: 2,
    defense: 0,
    speed: -1,
    special: 1,
  },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}
Snogrin.value = ICE_SNOWMAN_MIDDLE

export const ICE_SNOWMAN_OLD: Fairy = {
  name: 'Snokong',
  id: 'ice_snowman_old',
  modelPath: '/models/snowman-old/snowman-old.fbx',
  description: 'A old ice fairy that seems like a come to live version of a childish winter project.',
  element: ELEMENTS.ICE,
  tier: 2,
  evolutionsList: [ICE_SNOWMAN_MIDDLE, null],
  statsGrowthSteps: {
    hp: 1,
    power: 2,
    defense: 1,
    speed: -2,
    special: 1,
  },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}
Snokong.value = ICE_SNOWMAN_OLD
export default [ICE_YETI_YOUNG, ICE_YETI_MIDDLE, ICE_SNOWMAN_YOUNG, ICE_SNOWMAN_MIDDLE, ICE_SNOWMAN_OLD]
