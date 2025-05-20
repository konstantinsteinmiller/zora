import { ELEMENTS } from '@/utils/enums.ts'

const elements: string[] = [...Object.values(ELEMENTS)] as const
export type Element = (typeof elements)[number]

export interface Spell {
  name: string
  element: Element
  icon: string
  mana: number
  effectText?: string
  buff?: {
    name: string
    value: number // [1 is 100%]
  }
  effect?: string
}

export interface AttackSpell extends Spell {
  speed: number
  damage: number
  charge: number
  onSpecial?: (hitTarget: any, attacker: any) => void
  effect?: string
  criticalHitText?: string
}
