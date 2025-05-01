import { ENERGY_BALL, OVERCHARGED } from '@/Story/Spells/energy.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { getStatGrowth } from '@/utils/fairy.ts'

const FEMALE_OLD_GROWTH_STEPS = {
  hp: 1,
  power: 2,
  defense: -1,
  speed: -1,
  special: 1,
}
export const ENERGY_FEMALE_OLD: Fairy = {
  name: 'Thunlady',
  id: 'energy_female_old',
  modelPath: '/models/energy-female-old/energy-female-old.fbx',
  description: 'An energy fairy.',
  element: ELEMENTS.ENERGY,
  tier: 2,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  evolutionsList: [null, null],
  statGrowthPerLevel: getStatGrowth(FEMALE_OLD_GROWTH_STEPS, 2),
  statsGrowthSteps: FEMALE_OLD_GROWTH_STEPS,
  stats: {
    name: 'Thunlady',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    power: 0,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [ENERGY_BALL],
  passiveSpells: [OVERCHARGED],
}

export default [ENERGY_FEMALE_OLD]
