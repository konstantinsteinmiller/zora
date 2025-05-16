import type { AttackSpell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const TOUCH_OF_DOOM: AttackSpell = {
  name: 'Touch of the doomed',
  element: ELEMENTS.DARK,
  speed: 1,
  damage: 20,
  mana: 10,
  specialEffect: `will agonize your opponent. Everytime impacted fairy uses an active spell, it's magic turns against himself and causes damage.`,
}
