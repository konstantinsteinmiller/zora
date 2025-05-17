import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const ENERGY_BALL: AttackSpell = {
  name: 'energyBall',
  element: ELEMENTS.ENERGY,
  icon: 'energyWhite',
  speed: 1.5,
  damage: 20,
  mana: 8,
}

/*******************
 ***** passive *****
 ******************/
export const SUPERCHARGED: Spell = {
  name: 'supercharged',
  element: ELEMENTS.ENERGY,
  icon: 'pentagramWhite',
  mana: 15,
  buff: {
    name: 'attack',
    value: 1.6,
  },
}
