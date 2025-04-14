import { ELEMENTS } from '@/utils/enums.ts'

const elements: string[] = [...Object.values(ELEMENTS)] as const
export type Element = (typeof elements)[number]

export interface Spell {
  name: string
  element: Element
  mana: number
  buff?: {
    name: string
    value: number // [1 is 100%]
  }
}

export interface AttackSpell extends Spell {
  speed: number
  damage: number
  charge: number
  onSpecial?: (hitTarget: any, attacker: any) => void
}
