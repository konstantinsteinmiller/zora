import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const ENERGY_FEMALE_OLD: Fairy = {
  name: 'Eclipse',
  id: 'dark_eclipse',
  modelPath: '/models/eclipse/eclipse.fbx',
  description:
    'Being almost impossible to find and even if witnessed almost nobody survives the encounter. The existence of the Eclipse fairy remains mere a legend.',
  element: ELEMENTS.DARK,
  tier: 3,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 1, power: 3, defense: -1, speed: 1, special: 0 },
  attackSpells: ['Space Slice', 'Dark Blast'],
  passiveSpells: ['Gravity Field'],
}

export default [ENERGY_FEMALE_OLD]
