import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const ENERGY_BALL: AttackSpell = {
  name: 'Energy Ball',
  element: ELEMENTS.ENERGY,
  speed: 1.5,
  damage: 20,
  mana: 8,
}

/*******************
 ***** passive *****
 ******************/
export const OVERCHARGED: Spell = {
  name: 'Overcharged',
  element: ELEMENTS.ENERGY,
  mana: 15,
  buff: {
    name: 'attack',
    value: 1.6,
  },
}
