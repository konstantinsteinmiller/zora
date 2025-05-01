import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const BLAZING_FEATHERS: AttackSpell = {
  name: 'Blazing Feathers',
  element: ELEMENTS.FIRE,
  speed: 2,
  damage: 15,
  mana: 8,
}

export const FIRE_BREEZE: AttackSpell = {
  name: 'Fire Breeze',
  element: ELEMENTS.FIRE,
  speed: 0.75,
  damage: 35,
  mana: 7,
}

export const SPARK: AttackSpell = {
  name: 'Spark',
  element: ELEMENTS.FIRE,
  speed: 3,
  damage: 8,
  mana: 2,
}

/*******************
 ***** passive *****
 ******************/
export const BLINDING_FIRE: Spell = {
  name: 'Blinding Fire',
  element: ELEMENTS.FIRE,
  mana: 3,
  onHit: (entity, enemy) => {
    enemy.dealDamage(enemy, entity, 5)
  },
}

export const FIERY_EVADE: Spell = {
  name: 'Fiery Evade',
  element: ELEMENTS.FIRE,
  mana: 15,
  onHit: (entity, enemy) => {
    /* dodge spell */
  },
}

export const FLASH: Spell = {
  name: 'Fiery Evade',
  element: ELEMENTS.FIRE,
  mana: 1,
  onHit: (entity, enemy) => {
    /* TODO make up skill */
  },
}
