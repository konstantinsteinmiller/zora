import type { AttackSpell, Spell } from '@/types/spells.ts'
import { ELEMENTS } from '@/utils/enums.ts'

/*******************
 ***** attack ******
 ******************/
export const FLOWER_POWER: AttackSpell = {
  name: 'Flower Power',
  element: ELEMENTS.NATURE,
  speed: 1,
  damage: 10,
  mana: 5,
  charge: 0 /* [0,1] */,
}

/*******************
 ***** defense *****
 ******************/
export const NATURES_SHIELD: Spell = {
  name: "Nature's Shield",
  element: ELEMENTS.NATURE,
  mana: 25,
  buff: {
    name: 'defense',
    value: 0.5,
  },
}
