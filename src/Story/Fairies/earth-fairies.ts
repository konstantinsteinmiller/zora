import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { type Ref, ref } from 'vue'

const Goygorin: Ref<Fairy | null> = ref(null)
const Goygorix: Ref<Fairy | null> = ref(null)

export const EARTH_GARGOYLE_YOUNG: Fairy = {
  name: 'Goygor',
  id: 'earth_gargoyle_young',
  modelPath: '/models/gargoyle-young/gargoyle-young.fbx',
  description:
    'A young earth gargoyle fairy, his love for stony surroundings makes it predictable where to find this fairy.',
  element: ELEMENTS.EARTH,
  tier: 0,
  evolutionsList: [null, Goygorin],
  statsGrowthSteps: { hp: 2, power: 1, defense: 1, speed: -2, special: -1 },
  spells: [],
  passiveSpells: [],
}

export const EARTH_GARGOYLE_MIDDLE: Fairy = {
  name: 'Goygorin',
  id: 'earth_gargoyle_middle',
  modelPath: '/models/gargoyle-middle/gargoyle-middle.fbx',
  description: 'An earth gargoyle fairy. Durable and sturdy at the cost of speed.',
  element: ELEMENTS.EARTH,
  tier: 1,
  evolutionsList: [EARTH_GARGOYLE_YOUNG, Goygorix],
  statsGrowthSteps: { hp: 2, power: 2, defense: 2, speed: -2, special: -2 },
  spells: [],
  passiveSpells: [],
}

export const EARTH_GARGOYLE_OLD: Fairy = {
  name: 'Goygorix',
  id: 'earth_gargoyle_old',
  modelPath: '/models/gargoyle-old/gargoyle-old.fbx',
  description: 'An old earth gargoyle fairy. His crushing attacks are brutal, even though Goygorix is very slow.',
  element: ELEMENTS.EARTH,
  tier: 2,
  evolutionsList: [EARTH_GARGOYLE_MIDDLE, null],
  statsGrowthSteps: { hp: 2, power: 3, defense: 2, speed: -3, special: -1 },
  spells: [],
  passiveSpells: [],
}
Goygorix.value = EARTH_GARGOYLE_OLD

export default [EARTH_GARGOYLE_YOUNG, EARTH_GARGOYLE_MIDDLE, EARTH_GARGOYLE_OLD]
