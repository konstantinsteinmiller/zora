<script setup lang="ts">
import ElementImg from '@/components/atoms/ElementImg.vue'
import StatRating from '@/components/atoms/StatRating.vue'
import useFairies from '@/use/useFairies.ts'
import { clamp, prependBaseUrl } from '@/utils/function.ts'
import { computed, type ComputedRef, type Ref, ref, watch } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

interface Fairy {
  name: string
  id: string
  avatar: string
  preview: string
}

const { fairiesList } = useFairies()

const { t } = useI18n()
const selectedFairy: Ref<Fairy | null> = ref(null)

const statsVisualsList: ComputedRef<Fairy | null> = computed(() => {
  if (selectedFairy.value === null) return []
  const stats = Object.entries(selectedFairy.value?.statsGrowthSteps).map(([key, value]) => {
    return { key, value }
  })
  // console.log('stats: ', stats)
  // const stat = stats[0]
  // console.log("stats['hp']: ", stat.value, clamp(3 + stat.value, 0, 5))
  // console.log('selectedFairy.value: ', selectedFairy.value)
  return [{ key: 'type', value: selectedFairy.value?.element }, ...stats]
})
const evolves: ComputedRef<string | null> = computed(() => {
  if (!selectedFairy?.value?.evolutionsList) return { from: null, to: null }
  const [from, to] = selectedFairy?.value?.evolutionsList
  return { from: from?.value ?? from, to: to?.value ?? to }
})

const selectedFairyNumber = computed(() => {
  if (selectedFairy.value === null) return 0
  const selectedFairyIndex = fairiesList.value.findIndex(fairy => fairy.id === selectedFairy.value?.id) + 1
  return selectedFairyIndex < 10
    ? `00${selectedFairyIndex}`
    : selectedFairyIndex < 100
      ? `0${selectedFairyIndex}`
      : selectedFairyIndex
})

const onEvolveClick = (evolution: Fairy) => {
  selectedFairy.value = fairiesList.value.find(fairy => fairy.id === evolution.id)
}

watch(
  fairiesList,
  newValue => {
    if (newValue.length >= 1) {
      selectedFairy.value = newValue[0]
    }
  },
  { deep: true, immediate: true }
)
</script>

<template lang="pug">
  div.collection.flex.gap-2.h-full.pt-6.pb-2.relative(
    v-if="$?.menuItem?.value === MENU.COLLECTION"
    class="w-full  max-h-[90vh]"
  )
    div.preview.mr-8.p-4.pt-0.px-6(class="min-w-[298px]")
      div.relative.overflow-visible(style="background: rgba(0, 0, 0, 0.0);"
        class="h-[300px] max-w-[250px] z-10 scale-[80%] -mt-6"
      )
        div.name.relative.p-1.h-8.flex.items-center.justify-center(class="!border-0 bg-[#151515]")
          div.rib(class="text-[17px] -mb-[2px]") {{ selectedFairy?.name ? t(selectedFairy.name) : '' }}
          img.frame.absolute.bottom-0.left-0.overflow-visible(src="/images/frames/hr.png" :alt="`horizontal-line`"
            class="!scale-[98%] h-[9px] -mb-[8px] z-20"
          )
        div.preview-img.relative(class="z-10 min-h-[290px]")
          img.fancy-frame.absolute.top-0.left-0(
            src="/images/frames/fancy-frame_512x512.png" :alt="`frame`"
            class="scale-[110%] h-[326px] -mt-[35px]"
          )
          img.object-cover(v-if="selectedFairy !== null" :src="selectedFairy?.preview" alt="Fairy Collection" class="")
          //img.absolute.bottom-0.right-0(v-if="selectedFairy !== null" :src="selectedFairy.avatar" :alt="`${selectedFairy.name} image`" class="max-h-16 mb-1 mr-1 !absolute")
          //img.frame.absolute.bottom-0.right-0(src="/images/frames/frame-selected_128x128.png" :alt="`frame`" class="h-16 scale-110 mb-1 mr-1")
        div.number.mt-4.text-lg.mb-1.flex.justify-center.items-center(
          v-if="selectedFairy?.statsGrowthSteps"
          class=""
        )
          div.rounded-full.w-24.p-2.flex.justify-center.items-center(class="bg-[#454545] py-[2px]") {{ selectedFairyNumber }}
        div.stats.mt-4.text-lg.rounded-xl.mb-1(
          v-if="selectedFairy && selectedFairy?.statsGrowthSteps" class=""
        )
          div.rib.px-2.rounded-t-lg(class="bg-[#454545] mb-[2px] py-[2px]") {{ selectedFairy.name }}
          div(class="mb-[2px]")
            div.px-2.text-sm(v-if="evolves.from" class="bg-[#454545] py-[2px]") {{ t('evolvesFrom') }}
              a.underline.text-blue-500(@click="onEvolveClick(evolves.from)") {{ evolves.from.name }}
            div.px-2.text-sm(v-if="evolves.to" class="bg-[#454545] py-[2px]") {{ t('evolvesTo') }}
              a.underline.text-blue-500(@click="onEvolveClick(evolves.to)") {{ evolves.to.name }}
          div(class="bg-[#acacac] mb-[2px]")
            div.grid.grid-cols-2(v-for="stat in statsVisualsList" :key="selectedFairy.id + stat.key" class="mb-[2px]")
              div.px-2(class="bg-[#454545] text-[13px] py-[1px]") {{ t(stat.key) }}
              div.px-2.bg-white.flex.items-center(class="text-[#454545] py-[1px]")
                div.rounded-full.flex.items-center(v-if="stat.key === 'type'" class="bg-[#454545] p-[2px] px-3")
                  ElementImg(:type="stat.value")
                  div.text-white.text-sm.px-1 {{ t(stat.value) }}
                StatRating(v-else :amount="clamp(3 + Math.round(stat.value), 0, 5)")
          div.px-2.rounded-b-lg.text-sm(class="bg-[#454545] py-[3px]") {{ selectedFairy.description }}
    div.list.card.glass.frame.gap-4.flex.justify-start.items-start.flex-wrap.p-4.mr-4.w-full(
      class="" style="background: rgba(0, 0, 0, 0.0); backdrop-filter: blur(0px);"
    )
      div.icons.gap-3.flex.justify-start.items-start.flex-wrap.w-full(
        class="" style="background: rgba(0, 0, 0, 0.0); backdrop-filter: blur(0px);"
      )
        div.w-16.max-h-16.relative(v-for="fairy in fairiesList" :key="fairy.id" class="" @click="selectedFairy = fairy")
          img.frame.absolute(v-if="selectedFairy?.id === fairy.id" src="/images/frames/frame-selected_128x128.png" :alt="`${fairy.name} frame selected`" class="h-16 scale-110")
          img.frame.absolute(v-else src="/images/frames/frame-normal_128x128.png" :alt="`${fairy.name} frame`" class="h-16 scale-110")
          div.flex.justify-center.items-center.h-full.w-full
            img(:src="fairy.avatar" :alt="`${fairy.name} image`" class="h-[60px] w-[60px]")
</template>

<style scoped lang="sass">
.spotlight
  background: radial-gradient(50px circle at 10px 10px, rgba(95, 21, 198, 0.19) 30%,  transparent 55%) !important
.rib
  & *, &
    font-family: 'Ribeye', serif
</style>

<i18n>
en:
  fairyCollection: "Fairy Collection"
  type: "Type"
  hp: "Hp"
  power: "Power"
  defense: "Defense"
  speed: "Speed"
  special: "Special Ability"
  evolvesFrom: "evolves from "
  evolvesTo: "evolves to "
de:
  fairyCollection: "Feen Sammlung"
  type: "Typ"
  hp: "Hp"
  power: "Angriff"
  defense: "Verteidigung"
  speed: "Geschwindigkeit"
  special: "Spezialfähigkeit"
  evolvesFrom: "Entwicklung aus "
  evolvesTo: "Entwicklung zu "
</i18n>
