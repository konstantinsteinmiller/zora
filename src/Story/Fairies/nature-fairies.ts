import { FLOWER_POWER, NATURES_SHIELD } from '@/Story/Spells/nature.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { getStatGrowth } from '@/utils/fairy.ts'
import { ref, type Ref } from 'vue'

const BUTTERFLY_MIDDLE_GROWTH_STEPS = {
  hp: 0,
  power: 0,
  defense: -2,
  speed: 3,
  special: 1,
}
export const NATURE_BUTTERFLY_MIDDLE: Fairy = {
  name: 'Dandalina',
  id: 'nature_butterfly_middle',
  modelPath: '/models/nature-butterfly-middle/nature-butterfly-middle.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [null, null],
  statGrowthPerLevel: getStatGrowth(BUTTERFLY_MIDDLE_GROWTH_STEPS, 1),
  statsGrowthSteps: BUTTERFLY_MIDDLE_GROWTH_STEPS,
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

const MUSHROOM_YOUNG_GROWTH_STEPS = {
  hp: 0,
  power: -1,
  defense: 0,
  speed: -1,
  special: 3,
}
const Mushiddle: Ref<Fairy | null> = ref(null)
export const NATURE_MUSHROOM_YOUNG: Fairy = {
  name: 'Mushyu',
  id: 'nature_mushroom_young',
  modelPath: '/models/mushroom-young/mushroom-young.fbx',
  description: 'A nature fairy, known for hiding near trees.',
  element: ELEMENTS.NATURE,
  tier: 0,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [null, Mushiddle],
  statGrowthPerLevel: getStatGrowth(MUSHROOM_YOUNG_GROWTH_STEPS, 1),
  statsGrowthSteps: MUSHROOM_YOUNG_GROWTH_STEPS,
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

const MUSHROOM_MIDDLE_GROWTH_STEPS = {
  hp: 2,
  power: -1,
  defense: 1,
  speed: -1,
  special: 1,
}
export const NATURE_MUSHROOM_MIDDLE: Fairy = {
  name: 'Mushiddle',
  id: 'nature_mushroom_middle',
  modelPath: '/models/mushroom-middle/mushroom-middle.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [NATURE_MUSHROOM_YOUNG, null],
  statGrowthPerLevel: getStatGrowth(MUSHROOM_MIDDLE_GROWTH_STEPS, 1),
  statsGrowthSteps: MUSHROOM_MIDDLE_GROWTH_STEPS,
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
