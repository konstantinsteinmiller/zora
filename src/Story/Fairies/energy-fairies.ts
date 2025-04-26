import { ENERGY_BALL, OVERCHARGED } from '@/Story/Spells/energy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'

export const ENERGY_FEMALE_OLD = {
  name: 'Thunlady',
  id: 'energy_female_old',
  modelPath: '/models/thunder-fairy-1/thunder-fairy-1.fbx',
  description: 'An energy fairy.',
  element: ELEMENTS.ENERGY,
  tier: 2,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(300, 2),
    power: calcStatGrowth(0.65, 2),
    defense: calcStatGrowth(12, 2),
    speed: calcStatGrowth(0.75, 2),
    special: calcStatGrowth(0.6, 2),
  },
  statsGrowthVisual: {
    power: 4,
    hp: 2,
    defense: 1,
    speed: 1,
    special: 2,
  },
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
