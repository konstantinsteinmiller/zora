import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { type Ref, ref } from 'vue'

const Meriddle: Ref<Fairy | null> = ref(null)

export const WATER_MERMAID_YOUNG: Fairy = {
  name: 'Merry',
  id: 'water_mermaid_young',
  modelPath: '/models/mermaid-young/mermaid-young.fbx',
  description: 'A young water fairy, known for its playful nature. Can be found in shallow waters.',
  element: ELEMENTS.WATER,
  tier: 0,
  evolutionsList: [null, Meriddle],
  statsGrowthSteps: { hp: -2, power: -1, defense: -1, speed: 3, special: 2 },
  spells: [],
  passiveSpells: [],
}

const Merquen = ref(null)
export const WATER_MERMAID_MIDDLE: Fairy = {
  name: 'Meriddle',
  id: 'water_mermaid_middle',
  modelPath: '/models/mermaid-middle/mermaid-middle.fbx',
  description: 'A water fairy, that you can often find in creeks and ponds.',
  element: ELEMENTS.WATER,
  tier: 1,
  evolutionsList: [WATER_MERMAID_YOUNG, Merquen],
  statsGrowthSteps: { hp: -1, power: 0, defense: -1, speed: 2, special: 2 },
  spells: [],
  passiveSpells: [],
}
Meriddle.value = WATER_MERMAID_MIDDLE

export const WATER_MERMAID_OLD: Fairy = {
  name: 'Merquen',
  id: 'water_mermaid_old',
  modelPath: '/models/mermaid-old/mermaid-old.fbx',
  description: 'A grown up water fairy that seems to like waterfalls and the big ocean.',
  element: ELEMENTS.WATER,
  tier: 2,
  evolutionsList: [Meriddle, null],
  statsGrowthSteps: { hp: 0, power: 1, defense: 0, speed: 1, special: 1 },
  spells: [],
  passiveSpells: [],
}
Merquen.value = WATER_MERMAID_OLD

export default [WATER_MERMAID_YOUNG, WATER_MERMAID_MIDDLE, WATER_MERMAID_OLD]
