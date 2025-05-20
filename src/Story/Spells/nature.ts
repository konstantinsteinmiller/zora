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

/*******************
 ***** defense *****
 ******************/
export const NATURES_SHIELD: Spell = {
  name: 'natureSShield',
  element: ELEMENTS.NATURE,
  icon: 'shieldWhite',
  mana: 25,
  buff: {
    name: 'defense',
    value: 0.5,
  },
}
