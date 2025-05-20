import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const SNOWBALL_TOSS: AttackSpell = {
  name: 'snowballToss',
  element: ELEMENTS.ICE,
  icon: 'iceWhite',
  speed: 1.25,
  damage: 15,
  mana: 5,
  criticalHitText: `Increase damage dealt to enemy for the next 15 seconds by 20%`,
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
  name: 'frostNeedle',
  element: ELEMENTS.ICE,
  icon: 'needlesWhite',
  speed: 2,
  damage: 10,
  mana: 5,
}

export const CHILLING_STRIKE: AttackSpell = {
  name: 'chillingStrike',
  element: ELEMENTS.ICE,
  icon: 'iceWhite',
  speed: 2,
  damage: 10,
  mana: 5,
  criticalHitText: `Slows enemy movement by 30% for 20 seconds`,
}

export const FREEZING_STRIKE: AttackSpell = {
  name: 'freezingStrike',
  element: ELEMENTS.ICE,
  icon: 'iceWhite',
  speed: 2.25,
  damage: 8,
  mana: 8,
  criticalHitText: `Slows enemy movement by 80% for 20 seconds`,
}

/*******************
 ***** defense *****
 ******************/
export const FROST_SHIELD: Spell = {
  name: 'frostShield',
  element: ELEMENTS.ICE,
  icon: 'shieldWhite',
  mana: 5,
  buff: {
    name: 'defense',
    value: 0.9,
  },
}

export const ARCTIC_BARRIER: Spell = {
  name: 'arcticBarrier',
  element: ELEMENTS.ICE,
  icon: 'shieldWhite',
  mana: 25,
  buff: {
    name: 'defense',
    value: 0.5,
  },
}
