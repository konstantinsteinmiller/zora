import { ENERGY_BALL, OVERCHARGED } from '@/Story/Spells/energy.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const ENERGY_FEMALE_OLD = {
  name: 'Thunlady',
  id: 'energy_female_old',
  modelPath: '/models/thunder-fairy-1/thunder-fairy-1.fbx',
  description: 'An energy fairy.',
  element: ELEMENTS.ENERGY,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statsProgressionList: [],
  statsGrowthVisual: {
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
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  currentSpell: { ...ENERGY_BALL },
  spells: [ENERGY_BALL],
  passiveSpells: [OVERCHARGED],
}

export default [ENERGY_FEMALE_OLD]
