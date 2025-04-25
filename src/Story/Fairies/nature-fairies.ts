import { FLOWER_POWER, NATURES_SHIELD } from '@/Story/Spells/nature.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const NATURE_BUTTERFLY_MIDDLE = {
  name: 'Dandalina',
  id: 'nature_butterfly_middle',
  modelPath: '/models/nature-fairy-1/nature-fairy-1.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statsProgressionList: [],
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
  currentSpell: { ...FLOWER_POWER },
  spells: [FLOWER_POWER],
  passiveSpells: [NATURES_SHIELD],
}

export default [NATURE_BUTTERFLY_MIDDLE]
