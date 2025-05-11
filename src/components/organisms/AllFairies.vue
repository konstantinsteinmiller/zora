<script setup lang="ts">
import ElementImg from '@/components/atoms/ElementImg.vue'
import { ENERGY_FEMALE_OLD } from '@/Story/Fairies/energy-fairies.ts'
import { FIRE_DRAGON_OLD } from '@/Story/Fairies/fire-fairies.ts'
import { ICE_SNOWMAN_YOUNG, ICE_YETI_MIDDLE } from '@/Story/Fairies/ice-fairies.ts'
import { METAL_SCORPION_OLD } from '@/Story/Fairies/metal-fairies.ts'
import { NATURE_BUTTERFLY_MIDDLE } from '@/Story/Fairies/nature-fairies.ts'
import { PSI_NIGHTMARE } from '@/Story/Fairies/psi-fairies.ts'
import type { Fairy } from '@/types/fairy.ts'
import { createFairy } from '@/utils/world.ts'
import { computed, ref } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'

const { t } = useI18n()

const fairyViewList = [MENU.FAIRY]

const showAllFairyList = computed(() => {
  return $?.menuItem?.value === MENU.FAIRY
})

const fairies = [
  createFairy(ENERGY_FEMALE_OLD.id, 8),
  // createFairy('ice_yeti_young', 18),
  { ...createFairy(FIRE_DRAGON_OLD.id, 11), name: 'cute Glurak' },
  createFairy(ICE_SNOWMAN_YOUNG.id, 11),
  createFairy(ICE_YETI_MIDDLE.id, 15),
  createFairy(NATURE_BUTTERFLY_MIDDLE.id, 32),
  // createFairy(FIRE_HARPY.id, 49),
  createFairy(METAL_SCORPION_OLD.id, 49),
  { ...createFairy(PSI_NIGHTMARE.id, 22), name: 'nighty' },
]
if (!$.player) {
  $.player = {
    allFairiesList: ref(fairies),
  }
} else {
  $.player.allFairiesList = ref(fairies)
}

// const thunlady = $.player.fairiesList.value[0]
// levelUpFairy(thunlady, 33)
// $.player.allFairiesList.value = fairies

const isFairySelected = (fairy: Fairy): boolean => {
  return $.player.fairiesList.value.some((selected: Fairy) => selected.id === fairy.id)
}

$.player.allFairiesList.value = $.player?.allFairiesList.value.map((fairy: Fairy) => {
  const hp = Math.ceil(Math.random() * 100)
  const xp = Math.ceil(Math.random() * 1000)
  const nextLevelXp = xp + Math.ceil(Math.random() * 200)
  return {
    ...fairy,
    // level: 10,
    // xp: xp,
    // nextLevelXp: nextLevelXp,
    stats: {
      ...fairy.stats,
      // hp:< hp,
      // hp: 100,
      // maxHp: 100,
      // maxHp: hp + Math.ceil(Math.random() * 20),
      mp: Math.ceil(Math.random() * 100),
    },
  }
})
console.log('$.player.allFairiesList.value: ', $.player.allFairiesList.value)
</script>

<template lang="pug">
  //.card.glass.frame
  div.h-full.relative.flex.justify-end(v-if="showAllFairyList" class="w-full h-full")
    div.flex.flex-col.gap-2(class="w-[380px]")
      div.card.glass.frame.flex.relative.items-center.justify-start(v-for="(fairy, index) in $.player?.allFairiesList.value" :key="`fairy-${index}`"
        class="w-full"
      )
        div.avatar.relative.justify-self-start.p-2
          template(v-if="isFairySelected(fairy)")
            img.normal-frame.absolute.top-1.left-1(
              src="/images/frames/frame-avatar_128x144.png" alt="frame"
              class="h-[52px] w-[52px] ml-[2px]"
            )
            img.self-start.rounded-full(v-if="fairy?.avatar"
              :src="fairy.avatar" :alt="`${fairy.name} image`"
              class="h-[48px] w-[48px]"
            )
          template(v-else)
            img.normal-frame.absolute.top-1.left-1(
              src="/images/frames/frame-avatar-simple_128x128.png" alt="frame"
              class="h-[52px] w-[52px] ml-[2px]"
            )
            img.self-start.rounded-full(v-if="fairy?.avatar"
              :src="fairy.avatar" :alt="`${fairy.name} image`"
              class="h-[48px] w-[48px]"
            )
          div.rib.absolute.-bottom-3.text-lg(
            class="left-[1.35rem] !text-[14px] !font-bold !text-center translate-y-[-2px]"
            :class="{'!left-6': fairy.level < 10, 'text-yellow-300': $.options.coloredUI }"
          )
            div.relative.bg-black.bg-opacity-70.px-1.h-4.bottom-2
              img.frame.absolute.bottom-0.left-0(
                src="/images/frames/frame-simple_128x128.png" alt="frame"
                class="h-4 w-16 -mt-1 scale-[120%]"
              )
              div.z-20(class="-translate-y-[5px]") {{ fairy.level }}

        div.flex.flex-col.justify-center.gap-1(class="ml-[2px]")
          div.flex.items-center.gap-2
            ElementImg(:type="fairy.element" class="w-6 h-5 ml-[2px]")
            div.rib.text-sm {{ fairy.name }}
          div.rib.text-sm.text-sm.flex.gap-2.justify-between.items-center(class="!text-[12px]")
            div.flex.items-center.gap-2
              img.self-start(
                src="/images/icons/heart_128x128.png" alt="heart image"
                class="h-4 w-5 ml-1 mt-[4px]" style="filter: grayscale(40%)"
              )
              div(class="ml-[2px]" :class="{'text-red-500': $.options.coloredUI }") {{ fairy.stats.hp }} / {{ fairy.stats.maxHp }}

            div.flex.items-center.gap-2
              img.self-start(
                src="/images/icons/mana_48x116.png" alt="mana image"
                class="h-6 w-3 ml-2 -mr-[2px] -mt-[4px]"
              )
              div(:class="{'text-blue-600': $.options.coloredUI }") {{ fairy.stats.mp }} / {{ fairy.stats.maxMp }}
            //div.ml-2(class="!text-[14px]" :class="{'text-yellow-300': $.options.coloredUI }") L-{{ fairy.level }}
            div.justify-self-end.flex.items-center.gap-2
              img.self-start(
                src="/images/icons/xp_256x256.png" alt="xp image"
                class="h-5 w-5 ml-1"
                style="filter: drop-shadow(0 0 2px #ffffffff);"
              )
              div {{ fairy.xp }} / {{ fairy.nextLevelXp }}
          div.level.rib.flex.gap-2.items-center.justify-end(class="!text-[12px]")

</template>

<style scoped lang="sass">
.rib
  & *, &
    font-family: 'Ribeye', serif
</style>

<i18n>
en:
  fairyCollection: "Fairy Collection"
  type: "Type"
  hp: "Hp"
  defense: "Defense"
  speed: "Speed"
  special: "Special Ability"
de:
  fairyCollection: "Feen Sammlung"
  type: "Typ"
  hp: "Hp"
  defense: "Verteidigung"
  speed: "Geschwindigkeit"
  special: "Spezialfähigkeit"
</i18n>
