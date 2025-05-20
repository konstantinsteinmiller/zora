<script setup lang="ts">
import type { Element } from '@/utils/enums.ts'

const props = defineProps({
  spell: {
    type: Object,
    required: true,
  },
})

const spellToIconMap = {
  heart: 'heart',
  ice: 'frost',
  iceWhite: 'frost-white',
  fire: 'fire',
  energy: 'thunder',
  energyWhite: 'thunder-white',
  pentagram: 'pentagram',
  pentagramWhite: 'pentagram-white',
  dark: 'dark',
  shield: 'shield',
  shieldWhite: 'shield-white',
  needle: 'needle',
  needleWhite: 'needle-white',
  needlesWhite: 'needles-white',
  brain: 'brain',
  brainWhite: 'brain-white',
  feetWhite: 'feet-white',
  painWhite: 'pain-white',
}
const elementToColorMpa: Record<Element, string> = {
  NATURE: 'rgba(21,198,98,0.34)',
  AIR: 'rgba(255,255,255,0.92)',
  WATER: 'rgba(45,107,251,0.84)',
  LIGHT: 'rgba(255,255,71,0.8)',
  ENERGY: 'rgba(95, 21, 198, 0.19)',
  PSI: 'rgba(7,108,133,0.87)',
  EARTH: 'rgba(139,69,19,0.53)',
  ICE: 'rgb(80,193,221)',
  FIRE: 'rgba(209,59,0,0.57)',
  DARK: 'rgba(47, 79, 79, 0.19)',
  METAL: 'rgba(185,193,198,0.93)',
  NEUTRAL: 'rgba(220, 220, 220, 0.19)',
}

const icon =
  (props.spell?.icon && `/images/icons/spells/${spellToIconMap[props.spell?.icon]}.png`) ||
  '/images/icons/spells/brain.png'
const color = elementToColorMpa[props.spell?.element?.toUpperCase()] || 'bg-gray-500'
const isAttackSpell = props.spell?.speed !== undefined
const isPassiveSpell = props.spell?.speed === undefined && props.spell?.element
</script>

<template lang="pug">
  //border border-[#e1a158] border-solid
  div.relative.spell-icon(class="scale-[90%]"
    :class="{ 'rounded-full': isAttackSpell, [`box-border rounded-xl ${color} border border-[#a58a4b] border-solid`]: isPassiveSpell }"
    :style="`${color ? `background: ${color};` : ''}`"
  )
    //src="/images/icons/spells/frost.png"
    div.absolute.top-0.left-0.w-20.h-20(class="w-[76px] h-[76px]"
      :class="{ 'attack-bg': isAttackSpell, 'passive-bg': isPassiveSpell }"
    )
    img(v-if="isAttackSpell || isPassiveSpell"
      :src="icon" alt="spell icon"
      class="w-20 h-[76px] scale-[45%]"
    )

</template>

<style scoped lang="sass">
.attack-bg
  background: url("/images/icons/spells/attack-bg.png")
  background-size: cover
  background-position: center
  background-repeat: no-repeat

.passive-bg
  background: url("/images/icons/spells/passive-bg.png")
  background-size: cover
  background-position: center
  background-repeat: no-repeat
</style>
