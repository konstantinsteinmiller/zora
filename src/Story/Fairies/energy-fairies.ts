import { ENERGY_BALL, SUPERCHARGED } from '@/Story/Spells/energy.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const ENERGY_FEMALE_OLD: Fairy = {
  name: 'Thunlady',
  id: 'energy_female_old',
  modelPath: '/models/energy-female-old/energy-female-old.fbx',
  description: 'An energy fairy.',
  element: ELEMENTS.ENERGY,
  tier: 2,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 1, power: 2, defense: -1, speed: -1, special: 1 },
  spells: [ENERGY_BALL, ENERGY_BALL],
  passiveSpells: [SUPERCHARGED, SUPERCHARGED],
}

export default [ENERGY_FEMALE_OLD]
