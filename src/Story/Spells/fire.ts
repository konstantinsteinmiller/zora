import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const BLAZING_FEATHERS: AttackSpell = {
  name: 'blazingFeathers',
  element: ELEMENTS.FIRE,
  icon: 'energyWhite',
  speed: 2,
  damage: 15,
  mana: 8,
}

export const FIRE_BREEZE: AttackSpell = {
  name: 'fireBreeze',
  element: ELEMENTS.FIRE,
  icon: 'energyWhite',
  speed: 0.75,
  damage: 35,
  mana: 7,
}

export const SPARK: AttackSpell = {
  name: 'spark',
  element: ELEMENTS.FIRE,
  icon: 'energyWhite',
  speed: 3,
  damage: 8,
  mana: 2,
}

/*******************
 ***** passive *****
 ******************/
export const BLINDING_FIRE: Spell = {
  name: 'blindingFire',
  element: ELEMENTS.FIRE,
  icon: 'painWhite',
  mana: 3,
  onHit: (entity, enemy) => {
    enemy.dealDamage(enemy, entity, 5)
  },
}

export const FIERY_EVADE: Spell = {
  name: 'fieryEvade',
  element: ELEMENTS.FIRE,
  icon: 'feetWhite',
  mana: 15,
  onHit: (entity, enemy) => {
    /* dodge spell */
  },
}

export const FLASH: Spell = {
  name: 'flash',
  element: ELEMENTS.FIRE,
  icon: 'feetWhite',
  mana: 1,
  onHit: (entity, enemy) => {
    /* TODO make up skill */
  },
}
