import { FLOWER_POWER, NATURES_SHIELD } from '@/Story/Spells/nature.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const NATURE_BUTTERFLY_MIDDLE = {
  id: 'nature_butterfly_middle',
  modelPath: '/models/nature-fairy-1/nature-fairy-1.fbx',
  description: 'A nature fairy, known for playing around flowers.',
  element: ELEMENTS.NATURE,
  level: 5,
  statsProgressionList: [
    {
      condition: (level: number) => level < 10,
      increase: {
        hp: 5,
        attack: 1.4,
        defense: 1.2,
        speed: 0.6,
        special: 0.6,
      },
    },
    {
      condition: (level: number) => level < 18,
      increase: {
        hp: 7,
        attack: 1.6,
        defense: 1.4,
        speed: 0.7,
        special: 0.7,
      },
    },
    {
      condition: (level: number) => level >= 18,
      increase: {
        hp: 8,
        attack: 1.8,
        defense: 1.5,
        speed: 0.8,
        special: 0.8,
      },
    },
  ],
  stats: {
    name: 'Blumella',
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
  defenseSpells: [NATURES_SHIELD],
}

export default [NATURE_BUTTERFLY_MIDDLE]
