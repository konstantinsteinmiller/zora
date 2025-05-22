import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const LIGHT_STARLIGHT: Fairy = {
  name: 'Starlight',
  id: 'light_starlight',
  modelPath: '/models/starlight/starlight.fbx',
  description: 'Legends tell, that it is the starlight fairies who light up the stars every night.',
  element: ELEMENTS.LIGHT,
  tier: 2,
  evolutionsList: [null, null],
  statsGrowthSteps: { hp: 0, power: 2, defense: -1, speed: 1, special: 2 },
  attackSpells: ['Star throw', 'Magnetar', 'supernova'],
  passiveSpells: ['nebula'],
}

export default [LIGHT_STARLIGHT]
