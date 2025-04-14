import { ARCTIC_BARRIER, FROST_NEEDLE, FROST_SHIELD, SNOWBALL_TOSS } from '@/Story/Spells/ice.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const ICE_YETI_YOUNG = {
  id: 'ice_yeti_young',
  modelPath: '/models/yeti-young/yeti-young.fbx',
  description: 'A young ice yeti fairy, known for its playful nature and snowy fur.',
  element: ELEMENTS.ICE,
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
    name: 'Yethog',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  currentSpell: { ...SNOWBALL_TOSS },
  spells: [SNOWBALL_TOSS, FROST_NEEDLE],
  defenseSpells: [FROST_SHIELD, ARCTIC_BARRIER],
}

export default [ICE_YETI_YOUNG]
