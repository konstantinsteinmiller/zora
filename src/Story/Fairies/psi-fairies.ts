import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { getStatGrowth } from '@/utils/fairy.ts'

const PSI_NIGHTMARE_GROWTH_STEPS = {
  hp: 0,
  power: 2,
  defense: -2,
  speed: 2,
  special: 1,
}
export const PSI_NIGHTMARE: Fairy = {
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
  evolutionsList: [null, null],
  statGrowthPerLevel: getStatGrowth(PSI_NIGHTMARE_GROWTH_STEPS, 2),
  statsGrowthSteps: PSI_NIGHTMARE_GROWTH_STEPS,
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

export default [PSI_NIGHTMARE]
