import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const SNOWBALL_TOSS: AttackSpell = {
  name: 'Snowball Toss',
  element: ELEMENTS.ICE,
  icon: 'iceWhite',
  speed: 1.2,
  damage: 20,
  mana: 5,
  charge: 0 /* [0,1] */,
  onSpecial: (hitTarget: any, attacker: any) => {
    /* give a defense debuff of 20% */
    const DURATION = 15000
    hitTarget.defense.buff = {
      ...hitTarget.defense.buff,
      value: 1.2,
      duration: DURATION,
      endTime: Date.now() + DURATION,
    }
  },
}

export const FROST_NEEDLE: AttackSpell = {
  name: 'Frost Needle',
  element: ELEMENTS.ICE,
  icon: 'needlesWhite',
  speed: 2,
  damage: 10,
  mana: 5,
  charge: 0 /* [0,1] */,
}

/*******************
 ***** defense *****
 ******************/
export const FROST_SHIELD: Spell = {
  name: 'Frost Shield',
  element: ELEMENTS.ICE,
  icon: 'shieldWhite',
  mana: 5,
  buff: {
    name: 'defense',
    value: 0.9,
  },
}

export const ARCTIC_BARRIER: Spell = {
  name: 'Arctic Barrier',
  element: ELEMENTS.ICE,
  icon: 'shieldWhite',
  mana: 25,
  buff: {
    name: 'defense',
    value: 0.5,
  },
}
