import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/

export const SCREAM: AttackSpell = {
  name: 'scream',
  element: ELEMENTS.PSI,
  icon: 'energyWhite',
  speed: 1.5,
  damage: 20,
  mana: 10,
}

/*******************
 ***** passive *****
 ******************/
export const AURA_OF_RAGE: Spell = {
  name: 'auraOfRage',
  element: ELEMENTS.PSI,
  icon: 'brainWhite',
  mana: 0,
  buff: {
    name: 'attack',
    value: 1.6,
  },
  effect: 'Your opponent is shaking with blind rage. Increases chance of missing his target by 20%.',
}
