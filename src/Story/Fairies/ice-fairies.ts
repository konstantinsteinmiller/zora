import { ARCTIC_BARRIER, FROST_NEEDLE, FROST_SHIELD, SNOWBALL_TOSS } from '@/Story/Spells/ice.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth, getStatGrowth } from '@/utils/fairy.ts'
import { type Ref, ref } from 'vue'

const Yetopa: Ref<Fairy | null> = ref(null)

const YETI_YOUNG_GROWTH_STEPS = {
  hp: 2,
  power: -1,
  defense: 1,
  speed: -1,
  special: 0,
}
export const ICE_YETI_YOUNG: Fairy = {
  name: 'Yethog',
  id: 'ice_yeti_young',
  modelPath: '/models/yeti-young/yeti-young.fbx',
  description: 'A young ice yeti fairy, known for its playful nature and snowy fur.',
  element: ELEMENTS.ICE,
  tier: 0,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [null, Yetopa],
  statGrowthPerLevel: getStatGrowth(YETI_YOUNG_GROWTH_STEPS, 0),
  statsGrowthSteps: YETI_YOUNG_GROWTH_STEPS,
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
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

const YETI_MIDDLE_GROWTH_STEPS = {
  hp: 3,
  power: 0,
  defense: 3,
  speed: -3,
  special: -1,
}
export const ICE_YETI_MIDDLE: Fairy = {
  name: 'Yetopa',
  id: 'ice_yeti_middle',
  modelPath: '/models/yeti-middle/yeti-middle.fbx',
  description: 'An old ice yeti fairy, only encounterable in the highest mountain tops.',
  element: ELEMENTS.ICE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [ICE_YETI_YOUNG, null],
  statGrowthPerLevel: getStatGrowth(YETI_MIDDLE_GROWTH_STEPS, 1),
  statsGrowthSteps: YETI_MIDDLE_GROWTH_STEPS,
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
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}
Yetopa.value = ICE_YETI_MIDDLE

export default [ICE_YETI_YOUNG, ICE_YETI_MIDDLE]
