import type { AttackSpell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

export const TOUCH_OF_DOOM: AttackSpell = {
  name: 'Touch of the doomed',
  element: ELEMENTS.DARK,
  icon: 'energyWhite',
  speed: 1,
  damage: 15,
  mana: 12,
  criticalHitText: `Opponent is agonized for 3 seconds. Everytime impacted fairy uses an active spell, it's magic turns against himself and causes damage.`,
}
