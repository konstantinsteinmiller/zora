import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const STONE_STRIKE: AttackSpell = {
  name: 'stoneStrike',
  element: ELEMENTS.EARTH,
  icon: 'energyWhite',
  speed: 0.75,
  damage: 25,
  mana: 5,
  criticalHitText: `deal an additional 25% damage`,
}

export const STONE_HAIL: AttackSpell = {
  name: 'stoneHail',
  element: ELEMENTS.EARTH,
  icon: 'needlesWhite',
  speed: 1.25,
  damage: 18,
  mana: 6,
  criticalHitText: `deal an additional 10% damage`,
}

export const METEOR: AttackSpell = {
  name: 'meteor',
  element: ELEMENTS.EARTH,
  icon: 'energyWhite',
  speed: 0.5,
  damage: 50,
  mana: 13,
  criticalHitText: `deal an additional 50% damage`,
}

/*******************
 ***** passive *****
 ******************/
export const STONE_SHIELD: Spell = {
  name: 'stoneShield',
  element: ELEMENTS.EARTH,
  icon: 'shieldWhite',
  mana: 1,
  effectText: `Increase defense by 50%`,
  onHit: (entity, enemy) => {},
}

export const STONE_WALL: Spell = {
  name: 'stoneWall',
  element: ELEMENTS.EARTH,
  icon: 'shieldWhite',
  mana: 3,
  effectText: `Increase defense by 100%`,
  onHit: (entity, enemy) => {},
}

export const STONE_SCALES: Spell = {
  name: 'stoneScales',
  element: ELEMENTS.EARTH,
  icon: 'shieldWhite',
  mana: 0,
  effectText: `Increase defense by 3`,
  onHit: (entity, enemy) => {},
}
