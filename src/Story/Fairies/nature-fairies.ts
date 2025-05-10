import { FLOWER_POWER, NATURES_SHIELD } from '@/Story/Spells/nature.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { ref, type Ref } from 'vue'

export const NATURE_BUTTERFLY_MIDDLE: Fairy = {
  name: 'Dandalina',
  id: 'nature_butterfly_middle',
  modelPath: '/models/nature-butterfly-middle/nature-butterfly-middle.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  tier: 1,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 0, power: 0, defense: -2, speed: 3, special: 1 },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}

const Mushiddle: Ref<Fairy | null> = ref(null)
export const NATURE_MUSHROOM_YOUNG: Fairy = {
  name: 'Mushyu',
  id: 'nature_mushroom_young',
  modelPath: '/models/mushroom-young/mushroom-young.fbx',
  description: 'A nature fairy, known for hiding near trees.',
  element: ELEMENTS.NATURE,
  tier: 0,
  evolutionsList: [null, Mushiddle],
  statsGrowthSteps: { hp: 0, power: -1, defense: 0, speed: -1, special: 3 },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}

export const NATURE_MUSHROOM_MIDDLE: Fairy = {
  name: 'Mushiddle',
  id: 'nature_mushroom_middle',
  modelPath: '/models/mushroom-middle/mushroom-middle.fbx',
  description: 'A nature fairy, known for hiding near trees and nourish on them.',
  element: ELEMENTS.NATURE,
  tier: 1,
  evolutionsList: [NATURE_MUSHROOM_YOUNG, null],
  statsGrowthSteps: { hp: 2, power: -1, defense: 1, speed: -1, special: 1 },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}
Mushiddle.value = NATURE_MUSHROOM_MIDDLE

export const NATURE_MOSS: Fairy = {
  name: 'Bogy',
  id: 'nature_moss',
  modelPath: '/models/moss/moss.fbx',
  description: `Common fairy kind, can be found hiding in 
    moss around swamps on the island. A legend says that this fairies 
    emit a glow, known as swamps light.
  `,
  element: ELEMENTS.NATURE,
  tier: 1,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: -1, power: 1, defense: 0, speed: 2, special: 0 },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}
export default [NATURE_BUTTERFLY_MIDDLE, NATURE_MUSHROOM_YOUNG, NATURE_MUSHROOM_MIDDLE, NATURE_MOSS]
