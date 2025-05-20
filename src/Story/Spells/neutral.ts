import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/

export const KNIGHTS_VENGEANCE: AttackSpell = {
  name: `knightSVengeance`,
  element: ELEMENTS.NEUTRAL,
  icon: 'brainWhite',
  speed: 1,
  damage: 20,
  mana: 10,
  effect: `Stun your opponent for 5 seconds. He can neither fly nor move. Current charge of his spell is paused.`,
}

/*******************
 ***** passive *****
 ******************/
export const STAND_YOUR_GROUND: Spell = {
  name: 'standYourGround',
  element: ELEMENTS.NEUTRAL,
  icon: 'shieldWhite',
  mana: 0,
  buff: {
    name: 'attack',
    value: 1.6,
  },
  effect: 'effect: party defense is increased by 10% as long as this fairy is not unconscious',
}
