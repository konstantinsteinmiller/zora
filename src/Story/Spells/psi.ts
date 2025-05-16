import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/

// export const AURA_OF_RAGE: AttackSpell = {
//   name: 'Aura of rage',
//   element: ELEMENTS.PSI,
//   speed: 1,
//   damage: 20,
//   mana: 10,
//   specialEffect: `will agonize your opponent. Everytime impacted fairy uses an active spell, it's magic turns against himself and causes damage.`,
// }

/*******************
 ***** passive *****
 ******************/
export const AURA_OF_RAGE: Spell = {
  name: 'Aura of rage',
  element: ELEMENTS.PSI,
  mana: 0,
  buff: {
    name: 'attack',
    value: 1.6,
  },
  effect: 'Your opponent is shaking with blind rage. Increases chance of missing his target by 20%.',
}
