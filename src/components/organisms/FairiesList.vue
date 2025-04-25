<script setup lang="ts">
import ElementImg from '@/components/atoms/ElementImg.vue'
import type { Fairy } from '@/types/fairy.ts'
import { createFairy } from '@/utils/world.ts'
import { computed, type Ref, ref } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const fairyViewList = [MENU.FAIRY, MENU.ATTACK_SPELLS, MENU.PASSIVE_SPELLS, MENU.ITEMS]

const showFairyList = computed(() => {
  return fairyViewList.includes($?.menuItem?.value)
})

$.player = {
  fairies: {
    fairiesList: ref([
      createFairy('energy_female_old', 8),
      createFairy('ice_yeti_young', 18),
      createFairy('ice_yeti_middle', 15),
      createFairy('nature_butterfly_middle', 32),
      createFairy('ice_yeti_middle', 58),
    ]),
  },
}

$.player.fairies.fairiesList.value = $.player?.fairies?.fairiesList.value.map(fairy => {
  const hp = Math.ceil(Math.random() * 100)
  return {
    ...fairy,
    stats: {
      ...fairy.stats,
      hp: hp,
      maxHp: hp + Math.ceil(Math.random() * 20),
      mp: Math.ceil(Math.random() * 100),
    },
  }
})
// console.log('$.player.fairies.fairiesList.value: ', $.player.fairies.fairiesList.value)
</script>

<template lang="pug">
  div.h-full.p-2.relative(
    v-if="showFairyList"
    class="w-full h-full"
  )
    div.w-full.mr-8.p-4.flex.flex-col.gap-6(class="w-[298px]")
      div.flex.flex-col.w-48.relative(v-for="(fairy, index) in $.player?.fairies?.fairiesList.value" :key="`fairy-${index}`"
        class="w-full h-full flex items-center justify-center"
      )
        img.fancy-frame.absolute.top-0.left-0(
          src="/images/frames/fancy-frame_512x128.png" alt="frame"
          class="h-24 w-96 -mt-1"
        )
        img.normal-frame.absolute.top-0.left-0(
          src="/images/frames/frame-normal_128x128.png" alt="frame"
          class="h-[72px] w-[72px] ml-2 mt-1"
        )
        //.glass.card.dark.frame
        img.self-start(v-if="fairy?.avatar"
          :src="fairy.avatar" :alt="`${fairy.name} image`"
          class="h-[60px] w-[60px] ml-4 mt-3"
        )
        div.absolute.left-20.top-1.flex.flex-col.justify-center.gap-1
          div.flex.items-center.gap-2
            ElementImg(:type="fairy.element" class="w-6 h-5 ml-[2px]")
            div.rib.text-sm {{ fairy.name }}
          div.rib.text-sm.text-sm.flex.gap-2.justify-start(class="!text-[12px]")
            img.self-start(
              src="/images/icons/heart_128x128.png" alt="heart image"
              class="h-4 w-5 ml-1 mt-[2px]" style="filter: grayscale(40%)"
            )
            div.text-red-500(class="ml-[2px]") {{ fairy.stats.hp }} / {{ fairy.stats.maxHp }}

            img.self-start(
              src="/images/icons/mana_48x116.png" alt="mana image"
              class="h-6 w-3 ml-2 -mr-[2px] -mt-[2px]"
            )
            div.text-blue-600 {{ fairy.stats.mp }} / {{ fairy.stats.maxMp }}
          div.level.rib.flex.gap-2.justify-between.items-center(class="!text-[12px]")
            div.text-yellow-300.ml-2(class="!text-[14px]") Lv.
            div.text-yellow-300(class="!text-[14px]") {{ fairy.level }}

            img.self-start(
              src="/images/icons/xp_256x256.png" alt="xp image"
              class="h-5 w-5 ml-1 mt-[2px]"
            )
            div {{ fairy.xp }} / {{ fairy.nextLevelXp }}

    //  div.relative.overflow-visible(style="background: rgba(0, 0, 0, 0.0);"
    //    class="h-[300px] max-w-[250px] z-10"
    //  )
    //    div.name.relative.p-1.h-8.flex.items-center.justify-center.overflow-visible(class="!border-0 bg-[#151515]")
    //      div.rib(class="text-[17px] -mb-[2px]") {{ selectedFairy?.name ? t(selectedFairy.name) : '' }}
    //      img.frame.absolute.bottom-0.left-0(src="/images/frames/hr.png" :alt="`horizontal-line`"
    //        class="!scale-[98%] h-[9px] -mb-[8px] z-10"
    //      )
    //    div.preview-img.relative(class="z-10")
    //      img.fancy-frame.absolute.top-0.left-0(
    //        src="/images/frames/fancy-frame_512x512.png" :alt="`frame`"
    //        class="scale-[110%] h-[326px] -mt-[35px]"
    //      )
    //      img.object-cover(v-if="selectedFairy !== null" :src="selectedFairy?.preview" alt="Fairy Collection" class="")
    //      //img.absolute.bottom-0.right-0(v-if="selectedFairy !== null" :src="selectedFairy.avatar" :alt="`${selectedFairy.name} image`" class="max-h-16 mb-1 mr-1 !absolute")
    //      //img.frame.absolute.bottom-0.right-0(src="/images/frames/frame-selected_128x128.png" :alt="`frame`" class="h-16 scale-110 mb-1 mr-1")
    //    div.number.mt-4.text-lg.mb-1.flex.justify-center.items-center(
    //      v-if="selectedFairy?.statsGrowthVisual"
    //      class=""
    //    )
    //      div.rounded-full.w-24.p-2.flex.justify-center.items-center(class="bg-[#454545] py-[2px]") {{ selectedFairyNumber }}
    //    div.stats.mt-4.text-lg.rounded-xl.mb-1(
    //      v-if="selectedFairy && selectedFairy?.statsGrowthVisual" class=""
    //    )
    //      div.rib.px-2.rounded-t-lg(class="bg-[#454545] mb-[2px] py-[2px]") {{ selectedFairy.name }}
    //      div(class="bg-[#acacac] mb-[2px]")
    //        div.grid.grid-cols-2(v-for="stat in statsVisualsList" :key="selectedFairy.id + stat.key" class="mb-[2px]")
    //          div.px-2(class="bg-[#454545] py-[1px]") {{ t(stat.key) }}
    //          div.px-2.bg-white.flex.items-center(class="text-[#454545] py-[1px]")
    //            div.rounded-full.flex.items-center(v-if="stat.key === 'type'" class="bg-[#454545] p-[2px] px-3")
    //              ElementImg(:type="stat.value")
    //              div.text-white.text-sm.px-1 {{ t(stat.value) }}
    //            StatRating(v-else :amount="stat.value")
    //      div.px-2.rounded-b-lg.text-sm(class="bg-[#454545] py-[3px]") {{ selectedFairy.description }}
    //div.list.card.glass.frame.gap-4.flex.items-start.justify-start.p-4.mr-4.mb-24.w-full(
    //  class="flex-basis-[10%]" style="background: rgba(0, 0, 0, 0.0); backdrop-filter: blur(0px);"
    //)
    //  div.w-16.h-16.relative(v-for="fairy in fairiesList" :key="fairy.id" class="" @click="selectedFairy = fairy")
    //    img.frame.absolute(v-if="selectedFairy?.id === fairy.id" src="/images/frames/frame-selected_128x128.png" :alt="`${fairy.name} frame selected`" class="h-16 scale-110")
    //    img.frame.absolute(v-else src="/images/frames/frame-normal_128x128.png" :alt="`${fairy.name} frame`" class="h-16 scale-110")
    //    div.flex.justify-center.items-center.h-full.w-full
    //      img(:src="fairy.avatar" :alt="`${fairy.name} image`" class="h-[60px] w-[60px]")
    //img.absolute.right-6(src="/images/logo/Zora_logo_300x246.png" alt="logo"
    //  class="w-[100px] bottom-[12px]"
    //)
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
