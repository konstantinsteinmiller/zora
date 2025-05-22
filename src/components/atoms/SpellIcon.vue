<script setup lang="ts">
import type { Element } from '@/utils/enums.ts'
import { targetSpell, draggedSpell, draggedUponFairy, draggedFromActiveFairySpells } from '@/use/useDraggable.ts'
import { computed, type ComputedRef, ref } from 'vue'

const props = defineProps({
  spell: {
    type: Object,
    required: true,
  },
  slotIndex: {
    type: Number,
    default: -1,
  },
  fairy: {
    type: Object,
    default: () => ({}),
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

const allowedElementsList = ref<string[]>([...(props.fairy?.allowedElementsList || [props.fairy?.element || ''])])

const icon = computed(
  () =>
    (props.spell?.icon && `/images/icons/spells/${spellToIconMap[props.spell?.icon]}.png`) ||
    '/images/icons/spells/brain.png'
)
const color = elementToColorMpa[props.spell?.element?.toUpperCase()] || 'bg-gray-500'
const isAttackSpell = props.spell?.speed !== undefined
const isPassiveSpell = props.spell?.speed === undefined && props.spell?.element && props.spell?.mana >= 0
const isTargetSpellAttackSpell = computed(() => targetSpell.value?.speed !== undefined)
const isDraggedSpellAttackSpell = computed(() => draggedSpell.value?.speed !== undefined)
const isDraggedSpellElementAllowed = computed(() => allowedElementsList.value.includes(draggedSpell?.value?.element))

const isSlotOfDraggedUponFairy = computed(() => {
  return draggedUponFairy.value?.uuid === props.fairy?.uuid
})

const showNotAllowed: ComputedRef<boolean> = computed(() => {
  return (
    !draggedFromActiveFairySpells.value &&
    ((isSlotOfDraggedUponFairy.value &&
      ((!isDraggedSpellAttackSpell.value && (props.slotIndex === 0 || props.slotIndex === 2)) ||
        (isDraggedSpellAttackSpell.value && (props.slotIndex === 1 || props.slotIndex === 3)))) ||
      (isSlotOfDraggedUponFairy.value &&
        !isDraggedSpellElementAllowed.value &&
        ((!isDraggedSpellAttackSpell.value && (props.slotIndex === 1 || props.slotIndex === 3)) ||
          (isDraggedSpellAttackSpell.value && (props.slotIndex === 0 || props.slotIndex === 2)))))
  )
})
</script>

<template lang="pug">
  //border border-[#e1a158] border-solid
  div.relative.spell-icon(class="scale-[90%]"
    :data-slot-index="props.slotIndex !== -1 ? props.slotIndex : -1"
    :class="{ 'rounded-full': isAttackSpell, [`box-border rounded-xl ${color} border border-[#a58a4b] border-solid`]: isPassiveSpell, 'is-attack-spell':isAttackSpell && props.parent !== 'fairySpells', 'is-passive-spell': isPassiveSpell && props.parent !== 'fairySpells'  }"
    :style="`${color ? `background: ${color};` : ''}`"
  )
    div.absolute.top-0.left-0.w-20.h-20(class="w-[76px] h-[76px]"
      :class="{ 'attack-bg': isAttackSpell, 'passive-bg': isPassiveSpell, 'is-attack-spell':isAttackSpell, 'is-passive-spell': isPassiveSpell }"
    )
    div.absolute.top-0.left-0.w-20.h-20(v-if="showNotAllowed"
      class="not-allowed w-[76px] h-[76px] z-20 !rounded-lg bg-red-600 opacity-40"
    )
    img(v-if="isAttackSpell || isPassiveSpell"
      :src="icon" alt="spell icon"
      class="w-20 h-[76px] scale-[45%]"
      :class="{ 'is-attack-spell':isAttackSpell, 'is-passive-spell': isPassiveSpell }"
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
