import { ANORGANIC_STRIKE, METAL_NEEDLE, STRUCTURAL_DAMAGE } from '@/Story/Spells/metal.ts'
import type { Fairy } from '@/types/fairy.ts'
import { ELEMENTS } from '@/utils/enums.ts'
import { ref } from 'vue'

const Metalord: any = ref(null)
const Scorgon: any | null = ref(null)

export const METAL_SCORPION_YOUNG: Fairy = {
  name: 'Metlor',
  id: 'metal_scorpion_young',
  modelPath: '/models/scorpion-young/scorpion-young.fbx',
  description:
    "A young metal fairy. This engineered fairy is a master hunter. It's metal body makes it very sturdy and fast.",
  element: ELEMENTS.METAL,
  tier: 0,
  evolutionsList: [null, Metalord],
  statsGrowthSteps: { hp: 0, power: 1, defense: 2, speed: 1, special: -3 },
  spells: [METAL_NEEDLE, ANORGANIC_STRIKE],
  passiveSpells: [STRUCTURAL_DAMAGE, STRUCTURAL_DAMAGE],
}

export const METAL_SCORPION_MIDDLE: Fairy = {
  name: 'Metalord',
  id: 'metal_scorpion_middle',
  modelPath: '/models/scorpion-middle/scorpion-middle.fbx',
  description: 'A metal fairy. This engineered fairy is a master hunter.',
  element: ELEMENTS.METAL,
  tier: 1,
  evolutionsList: [METAL_SCORPION_YOUNG, Scorgon],
  statsGrowthSteps: { hp: 0, power: 3, defense: 2, speed: 0, special: -3 },
  spells: [METAL_NEEDLE, ANORGANIC_STRIKE],
  passiveSpells: [STRUCTURAL_DAMAGE, STRUCTURAL_DAMAGE],
}
Metalord.value = METAL_SCORPION_MIDDLE

export const METAL_SCORPION_OLD: Fairy = {
  name: 'Scorgon',
  id: 'metal_scorpion_old',
  modelPath: '/models/scorpion-old/scorpion-old.fbx',
  description:
    'A masterful metal fairy. This engineered fairy has unmatched defense. His metal scales are unpenetrable.',
  element: ELEMENTS.METAL,
  tier: 2,
  evolutionsList: [METAL_SCORPION_MIDDLE, null],
  statsGrowthSteps: { hp: 2, power: 1, defense: 4, speed: -2, special: -2 },
  spells: [METAL_NEEDLE, ANORGANIC_STRIKE],
  passiveSpells: [STRUCTURAL_DAMAGE, STRUCTURAL_DAMAGE],
}
Scorgon.value = METAL_SCORPION_OLD

export default [METAL_SCORPION_YOUNG, METAL_SCORPION_MIDDLE, METAL_SCORPION_OLD]
