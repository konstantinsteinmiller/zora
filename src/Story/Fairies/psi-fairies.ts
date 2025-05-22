import { AURA_OF_RAGE, SCREAM } from '@/Story/Spells/psi.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const PSI_NIGHTMARE: Fairy = {
  name: 'Nightsing',
  id: 'psi_nightmare',
  modelPath: '/models/psi-nightmare/psi-nightmare.fbx',
  description:
    'A psi fairy. Who knows, whether this fairy originates from the scariest dreams or otherwise - this dreams are caused by this fairy.\n' +
    'Nightmare fairies specializes in mental attacks and special effect infliction. Legends tell that this kind is originated from the Nightmare Forest from the depth of the Wildlands.',
  element: ELEMENTS.PSI,
  tier: 2,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 0, power: 2, defense: -2, speed: 2, special: 1 },
  attackSpells: [SCREAM, SCREAM],
  passiveSpells: [AURA_OF_RAGE, AURA_OF_RAGE],
}

export default [PSI_NIGHTMARE]
