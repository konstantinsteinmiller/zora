import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const METAL_NEEDLE: AttackSpell = {
  name: 'metalNeedle',
  element: ELEMENTS.METAL,
  icon: 'needle',
  speed: 1.5,
  damage: 20,
  mana: 8,
}

export const ANORGANIC_STRIKE: AttackSpell = {
  name: 'anorganicStrike',
  element: ELEMENTS.METAL,
  icon: 'energy',
  speed: 1.5,
  damage: 20,
  mana: 12,
  criticalHitText: `deal an additional 20% damage`,
}

/*******************
 ***** passive *****
 ******************/
export const METALLIC_SURGE: Spell = {
  name: 'metallicSurge',
  element: ELEMENTS.METAL,
  icon: 'energy',
  mana: 7,
  effectText: `Increase damage by 10`,
  onCriticalHit: (entity, enemy) => {
    // enemy.dealDamage(enemy, entity, 5)
    // deal 2 armor damage to the enemy
  },
}

export const STRUCTURAL_DAMAGE: Spell = {
  name: 'structuralDamage',
  element: ELEMENTS.METAL,
  icon: 'pentagram',
  mana: 5,
  effectText: `Reduce enemy armor by 2`,
  onCriticalHit: (entity, enemy) => {
    // enemy.dealDamage(enemy, entity, 5)
    // deal 2 armor damage to the enemy
  },
}
