import { FLOWER_POWER, NATURES_SHIELD } from '@/Story/Spells/nature.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'
import { ref, type Ref } from 'vue'

export const NATURE_BUTTERFLY_MIDDLE = {
  name: 'Dandalina',
  id: 'nature_butterfly_middle',
  modelPath: '/models/nature-fairy-1/nature-fairy-1.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(230, 1),
    power: calcStatGrowth(0.45, 1),
    defense: calcStatGrowth(10, 1),
    speed: calcStatGrowth(0.5, 1),
    special: calcStatGrowth(0.4, 1),
  },
  statsGrowthVisual: {
    hp: 5,
    defense: 3,
    speed: 2,
    special: 4,
  },
  stats: {
    name: 'Dandalina',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}

const Mushiddle: Ref<Fairy | null> = ref(null)
export const NATURE_MUSHROOM_YOUNG = {
  name: 'Mushyu',
  id: 'nature_mushroom_young',
  modelPath: '/models/mushroom-young/mushroom-young.fbx',
  description: 'A nature fairy, known for hiding near trees.',
  element: ELEMENTS.NATURE,
  tier: 0,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(150, 0),
    power: calcStatGrowth(0.65, 0),
    defense: calcStatGrowth(10, 0),
    speed: calcStatGrowth(0.5, 0),
    special: calcStatGrowth(1.2, 0),
  },
  evolutionsList: [null, Mushiddle],
  statsGrowthVisual: {
    hp: 5,
    defense: 3,
    speed: 2,
    special: 4,
  },
  stats: {
    name: 'Mushyu',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}

export const NATURE_MUSHROOM_MIDDLE = {
  name: 'Mushiddle',
  id: 'nature_mushroom_middle',
  modelPath: '/models/mushroom-middle/mushroom-middle.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(230, 1),
    power: calcStatGrowth(0.65, 1),
    defense: calcStatGrowth(13, 1),
    speed: calcStatGrowth(0.3, 1),
    special: calcStatGrowth(0.8, 1),
  },
  evolutionsList: [NATURE_MUSHROOM_YOUNG, null],
  statsGrowthVisual: {
    hp: 5,
    defense: 3,
    speed: 2,
    special: 4,
  },
  stats: {
    name: 'Mushiddle',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}
Mushiddle.value = NATURE_MUSHROOM_MIDDLE

export default [NATURE_BUTTERFLY_MIDDLE, NATURE_MUSHROOM_YOUNG, NATURE_MUSHROOM_MIDDLE]
