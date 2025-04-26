import { FLOWER_POWER, NATURES_SHIELD } from '@/Story/Spells/nature.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'

export const NATURE_BUTTERFLY_MIDDLE = {
  name: 'Dandalina',
  id: 'nature_butterfly_middle',
  modelPath: '/models/nature-fairy-1/nature-fairy-1.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  tier: 1,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(230, 1),
    power: calcStatGrowth(0.45, 1),
    defense: calcStatGrowth(10, 1),
    speed: calcStatGrowth(0.5, 1),
    special: calcStatGrowth(0.4, 1),
  },
  statsGrowthVisual: {
    hp: 5,
    defense: 3,
    speed: 2,
    special: 4,
  },
  stats: {
    name: 'Dandalina',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}

export default [NATURE_BUTTERFLY_MIDDLE]
