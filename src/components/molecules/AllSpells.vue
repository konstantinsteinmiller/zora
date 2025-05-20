<script setup lang="ts">
import SpellIcon from '@/components/atoms/SpellIcon.vue'
import StatRating from '@/components/atoms/StatRating.vue'
import $ from '@/global.ts'
import type { AttackSpell, Spell } from '@/types/spells.ts'
import useMenu from '@/use/useDraggable.ts'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { clamp } from 'three/src/math/MathUtils.js'

const { t } = useI18n()

const spellsList = ref<(Spell | AttackSpell)[]>($.player.spells.spellsList)
const selectedSpell = ref<Spell | AttackSpell | null>(null)
const isAttackSpell = computed(() => {
  console.log(JSON.stringify(selectedSpell.value, undefined, 2))
  return selectedSpell.value?.speed !== undefined && selectedSpell.value?.name
})
const isPassiveSpell = computed(() => {
  console.log(JSON.stringify(selectedSpell.value, undefined, 2))
  return selectedSpell.value?.speed === undefined && selectedSpell.value?.mana >= 0 && selectedSpell.value?.name
})
const selectedSpellDamage = computed(() => Math.ceil(selectedSpell.value?.damage / 5))
// console.log('fairySpellsList: ', fairySpellsList.value)
const { onDragStartSpell, onEndSpell, onDropSpell } = useMenu(spellsList, 'all-spells-list')
</script>

<template lang="pug">
  div.all-spells.flex.flex-col.relative.w-full.items-start.justify-start
    draggable(
      v-model="spellsList"
      group="spells"
      item-key="name"
      draggable=".all-spell-detail"
      ghost-class="all-spell-detail"
      @start="onDragStartSpell"
      @end="onEndSpell"
      @change="onDropSpell"
      class="all-spells-list flex flex-wrap flex-shrink-1 p-2 gap-1 gap-y-1 items-start justify-start max-h-[520px] overflow-auto"
    )
      template(v-slot:item="{ element, index }")
        div.flex.w-20.h-20.relative(class="p-[2px]" @click="selectedSpell = element")
          img.absolute.top-0.left-0(v-if="selectedSpell?.name === element.name" src="/images/frames/frame-selected_128x128.png" alt="frame"
            class="w-[80px] h-[80px] z-20 scale-[110%]"
          )
          SpellIcon(
            class="all-spell-detail draggable cursor-grab"
            :spell="element" :key="index"
            :index="index"
            :data-index="index"
          )
    div.flex.flex-col.mx-2
      div.rib.text-lg {{ t(selectedSpell?.name || '') || '' }}
      div.grid.grid-cols-3.mx-2.mt-2.text-base(v-if="isAttackSpell")
        div.max-w-48.min-w-48 {{ t('stats.damage') }}:
        StatRating.col-span-2(:amount="clamp(selectedSpellDamage, 0, 5)")
        div.max-w-48.min-w-48 {{ t('stats.mana') }}:
        StatRating.col-span-2(:amount="clamp(Math.ceil(selectedSpell.mana / 2.5), 0, 5)")
        div.max-w-48.min-w-48 {{ t('stats.fireRate') }}:
        StatRating.col-span-2(:amount="clamp(Math.ceil(selectedSpell.speed * 2), 0, 5)")
        template.text-base(v-if="selectedSpell?.criticalHitText")
          div.max-w-48.min-w-48 {{ t('stats.criticalHit') }}:
          div.col-span-2 {{ t(selectedSpell?.criticalHitText || '') }}
      div.grid.grid-cols-3.mx-2.mt-2.text-base(v-if="isPassiveSpell")
        div.max-w-48.min-w-48 {{ t('stats.mana') }}:
        StatRating.col-span-2(:amount="clamp(Math.ceil(selectedSpell.mana / 2.5), 0, 5)")
        template.text-base(v-if="selectedSpell?.effectText")
          div.max-w-48.min-w-48 {{ t('stats.effect') }}:
          div.col-span-2 {{ t(selectedSpell?.effectText || '') }}
</template>

<style scoped lang="sass"></style>
