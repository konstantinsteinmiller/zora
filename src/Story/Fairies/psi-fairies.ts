import { ELEMENTS } from '@/utils/enums.ts'
import { calcStatGrowth } from '@/utils/fairy.ts'

export const FIRE_HARPY = {
  name: 'Nightsing',
  id: 'psi_nightmare',
  modelPath: '/models/psi-nightmare/psi-nightmare.fbx',
  description:
    'A psi fairy. Who knows, whether this fairy originates from the scariest dreams or otherwise - this dreams are caused by this fairy.\n' +
    'Despite being physically weak, nimble nightmare fairies specializes in mental attacks and special effect infliction. Legends tell that this kind is originated from the Nightmare Forest from the depth of the Wildlands, but today, if you are unlucky, you can meet her even in urban terrain, feasting on the nightmares of inhabitants.',
  element: ELEMENTS.PSI,
  tier: 2,
  level: 5,
  xp: 0,
  nextLevelXp: 10,
  statGrowthPerLevel: {
    hp: calcStatGrowth(220, 2),
    power: calcStatGrowth(0.85, 2),
    defense: calcStatGrowth(2, 2),
    speed: calcStatGrowth(1, 2),
    special: calcStatGrowth(1.25, 2),
  },
  statsGrowthVisual: {
    hp: 2,
    defense: 1,
    speed: 3,
    special: 5,
  },
  stats: {
    name: 'Nightsing',
    hp: 25,
    previousHp: 25,
    maxHp: 25,
    damage: 7,
    defense: 6,
    speed: 3,
    special: 3,
  },
  spells: [],
  passiveSpells: [],
}

export default [FIRE_HARPY]
