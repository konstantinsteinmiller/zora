import { ARCTIC_BARRIER, FROST_NEEDLE, FROST_SHIELD, SNOWBALL_TOSS } from '@/Story/Spells/ice.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'
import { type Ref, ref } from 'vue'

const Yetopa: Ref<Fairy | null> = ref(null)
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
  statGrowthPerLevel: {
    hp: calcStatGrowth(180, 0),
    power: calcStatGrowth(0.35, 0),
    defense: calcStatGrowth(8, 0),
    speed: calcStatGrowth(1, 0),
    special: calcStatGrowth(0.75, 0),
  },
  evolutionsList: [null, Yetopa],
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
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

export const ICE_YETI_MIDDLE = {
  name: 'Yetopa',
  id: 'ice_yeti_middle',
  modelPath: '/models/yeti-middle/yeti-middle.fbx',
  description: 'An old ice yeti fairy, only encounterable in the highest mountain tops.',
  element: ELEMENTS.ICE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(280, 1),
    power: calcStatGrowth(0.5, 1),
    defense: calcStatGrowth(20, 1),
    speed: calcStatGrowth(0.25, 1),
    special: calcStatGrowth(0.5, 1),
  },
  evolutionsList: [ICE_YETI_YOUNG, null],
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
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  passiveSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}
Yetopa.value = ICE_YETI_MIDDLE

export default [ICE_YETI_YOUNG, ICE_YETI_MIDDLE]
