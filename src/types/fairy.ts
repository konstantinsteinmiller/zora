export interface Fairy {
  name: string
  level: number
  element: string
  primaryAttackSpell?: {
    name: string
    damage: number
    speed: number
    element: string
  }
  primaryDefenseSpell?: {
    name: string
    damage: number
    speed: number
    element: string
  }
  secondaryAttackSpell?: {
    name: string
    damage: number
    speed: number
    element: string
  }
  secondaryDefenseSpell?: {
    name: string
    damage: number
    speed: number
    element: string
  }
}
