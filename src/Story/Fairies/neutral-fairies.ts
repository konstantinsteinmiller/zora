import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { type Ref, ref } from 'vue'

const Verona: Ref<Fairy | null> = ref(null)

export const NEUTRAL_WARRIOR_YOUNG: Fairy = {
  name: 'Vera',
  id: 'neutral_warrior_young',
  modelPath: '/models/warrior-young/warrior-young.fbx',
  description: 'A young warrior fairy. Often seen as foreplay in the arena.',
  element: ELEMENTS.NEUTRAL,
  tier: 0,
  evolutionsList: [null, Verona],
  statsGrowthSteps: { hp: -1, power: 3, defense: 0, speed: 2, special: -3 },
  spells: [],
  passiveSpells: [],
}

export const NEUTRAL_WARRIOR_MIDDLE: Fairy = {
  name: 'Verona',
  id: 'neutral_warrior_middle',
  modelPath: '/models/warrior-middle/warrior-middle.fbx',
  description:
    'An adult warrior fairy, very popular in the arena. In rare cases, may appear on the places of large battles or ancient burials of warriors.',
  element: ELEMENTS.NEUTRAL,
  tier: 2,
  evolutionsList: [NEUTRAL_WARRIOR_YOUNG, null],
  statsGrowthSteps: { hp: 0, power: 3, defense: 1, speed: 1, special: -3 },
  spells: [],
  passiveSpells: [],
}
Verona.value = NEUTRAL_WARRIOR_MIDDLE

export const NEUTRAL_HOUSEHOLD: Fairy = {
  name: 'Housyu',
  id: 'neutral_household',
  modelPath: '/models/household/household.fbx',
  description: `A household fairy. Often wears dirty rags since lots of owners do not care
    about fairies well-being.
  `,
  element: ELEMENTS.NEUTRAL,
  tier: 1,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: -1, power: 0, defense: -1, speed: 4, special: 0 },
  spells: [],
  passiveSpells: [],
}

export default [NEUTRAL_WARRIOR_YOUNG, NEUTRAL_WARRIOR_MIDDLE, NEUTRAL_HOUSEHOLD]
