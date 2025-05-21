import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const FLOWER_POWER: AttackSpell = {
  name: 'flowerPower',
  element: ELEMENTS.NATURE,
  icon: 'energyWhite',
  speed: 1,
  damage: 10,
  mana: 5,
}

export const POLLEN_CLOUD: AttackSpell = {
  name: 'pollenCloud',
  element: ELEMENTS.NATURE,
  icon: 'painWhite',
  speed: 0.75,
  damage: 25,
  mana: 5,
  criticalHitText: `affected enemies take an additional 5 damage over 10 seconds`,
}

/*******************
 ***** defense *****
 ******************/
export const NATURES_SHIELD: Spell = {
  name: 'natureSShield',
  element: ELEMENTS.NATURE,
  icon: 'shieldWhite',
  mana: 8,
  buff: {
    name: 'defense',
    value: 0.5,
  },
}

export const PROTECTIVE_BRANCHES: Spell = {
  name: 'protectiveBranches',
  element: ELEMENTS.NATURE,
  icon: 'shieldWhite',
  mana: 2,
  effectText: `blocks 4 damage on each attack`,
}
