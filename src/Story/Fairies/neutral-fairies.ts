import { TOUCH_OF_DOOM } from '@/Story/Spells/dark.ts'
import { KNIGHTS_VENGEANCE, STAND_YOUR_GROUND } from '@/Story/Spells/neutral.ts'
import { AURA_OF_RAGE } from '@/Story/Spells/psi.ts'
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

export const NEUTRAL_ASHA: Fairy = {
  name: 'Asha',
  id: 'neutral_asha',
  modelPath: '/models/asha/asha.fbx',
  description: `Asha, daughter of Abylean, is a neutral fairy. Asha defended her homeland from human invaders for as long as possible. Her resistance turned her into a flame of pure hatred.`,
  element: ELEMENTS.NEUTRAL,
  tier: 3,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 2, power: 1, defense: 2, speed: 0, special: -1 },
  spells: [TOUCH_OF_DOOM, KNIGHTS_VENGEANCE],
  passiveSpells: [AURA_OF_RAGE, STAND_YOUR_GROUND],
}

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

export default [NEUTRAL_WARRIOR_YOUNG, NEUTRAL_WARRIOR_MIDDLE, NEUTRAL_ASHA, NEUTRAL_HOUSEHOLD]
