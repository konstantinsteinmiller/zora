<script setup lang="ts">
import ElementImg from '@/components/atoms/ElementImg.vue'
import StatRating from '@/components/atoms/StatRating.vue'
import { computed, type ComputedRef, type Ref, ref, onMounted, watch } from 'vue'
import { MENU } from '@/utils/enums.ts'
import $ from '@/global'
import { useI18n } from 'vue-i18n'

// $.menuItem.value =

interface Fairy {
  name: string
  id: string
  avatar: string
  preview: string
}

const fairiesList: Ref<Fairy[]> = ref([])

const loadFairies = async () => {
  const fairyModules = import.meta.glob('@/Story/Fairies/*.ts', { eager: true })
  fairiesList.value = Object.values(fairyModules).reduce((acc, elementalFairiesList) => {
    // const elementalFairiesList = module.default
    acc = [
      ...acc,
      ...elementalFairiesList.default.map((fairy: Fairy) => {
        let modelPath = fairy.modelPath.split('/')
        modelPath.pop()
        const imagePath = modelPath.join('/')
        return { ...fairy, avatar: `${imagePath}/avatar_128x128.jpg`, preview: `${imagePath}/preview_400x463.jpg` }
      }),
    ]
    return acc
  }, [])
  // console.log('fairies: ', fairiesList.value)
}
loadFairies()

const { t } = useI18n()
const selectedFairy: Ref<Fairy | null> = ref(null)
const statsVisualsList: ComputedRef<Fairy | null> = computed(() => {
  if (selectedFairy.value === null) return []
  const stats = Object.entries(selectedFairy.value?.statsGrowthVisual).map(([key, value]) => {
    return { key, value }
  })
  // console.log('selectedFairy.value.element: ', selectedFairy.value)
  return [{ key: 'type', value: selectedFairy.value?.element }, ...stats]
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

watch(
  fairiesList,
  newValue => {
    console.log('newValue: ', newValue.length)
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
    class="w-full h-full"
  )
    div.preview.mr-8.p-4.px-6(class="min-w-[298px]")
      div.relative.overflow-visible(style="background: rgba(0, 0, 0, 0.0);"
        class="h-[300px] max-w-[250px] z-10"
      )
        div.name.relative.p-1.h-8.flex.items-center.justify-center.overflow-visible(class="!border-0 bg-[#151515]")
          div.rib(class="text-[17px] -mb-[2px]") {{ selectedFairy?.name ? t(selectedFairy.name) : '' }}
          img.frame.absolute.bottom-0.left-0(src="/images/frames/hr.png" :alt="`horizontal-line`"
            class="!scale-[98%] h-[9px] -mb-[8px] z-10"
          )
        div.preview-img.relative(class="z-10")
          img.fancy-frame.absolute.top-0.left-0(
            src="/images/frames/fancy-frame_512x512.png" :alt="`frame`"
            class="scale-[110%] h-[326px] -mt-[35px]"
          )
          img.object-cover(v-if="selectedFairy !== null" :src="selectedFairy?.preview" alt="Fairy Collection" class="")
          //img.absolute.bottom-0.right-0(v-if="selectedFairy !== null" :src="selectedFairy.avatar" :alt="`${selectedFairy.name} image`" class="max-h-16 mb-1 mr-1 !absolute")
          //img.frame.absolute.bottom-0.right-0(src="/images/frames/frame-selected_128x128.png" :alt="`frame`" class="h-16 scale-110 mb-1 mr-1")
        div.number.mt-4.text-lg.mb-1.flex.justify-center.items-center(
          v-if="selectedFairy?.statsGrowthVisual"
          class=""
        )
          div.rounded-full.w-24.p-2.flex.justify-center.items-center(class="bg-[#454545] py-[2px]") {{ selectedFairyNumber }}
        div.stats.mt-4.text-lg.rounded-xl.mb-1(
          v-if="selectedFairy && selectedFairy?.statsGrowthVisual" class=""
        )
          div.rib.px-2.rounded-t-lg(class="bg-[#454545] mb-[2px] py-[2px]") {{ selectedFairy.name }}
          div(class="bg-[#acacac] mb-[2px]")
            div.grid.grid-cols-2(v-for="stat in statsVisualsList" :key="selectedFairy.id + stat.key" class="mb-[2px]")
              div.px-2(class="bg-[#454545] py-[1px]") {{ t(stat.key) }}
              div.px-2.bg-white.flex.items-center(class="text-[#454545] py-[1px]")
                div.rounded-full.flex.items-center(v-if="stat.key === 'type'" class="bg-[#454545] p-[2px] px-3")
                  ElementImg(:type="stat.value")
                  div.text-white.text-sm.px-1 {{ t(stat.value) }}
                StatRating(v-else :amount="stat.value")
          div.px-2.rounded-b-lg.text-sm(class="bg-[#454545] py-[3px]") {{ selectedFairy.description }}
    div.list.card.glass.frame.gap-4.flex.items-start.justify-start.p-4.mr-4.mb-24.w-full(
      class="flex-basis-[10%]" style="background: rgba(0, 0, 0, 0.0); backdrop-filter: blur(0px);"
    )
      div.w-16.h-16.relative(v-for="fairy in fairiesList" :key="fairy.id" class="" @click="selectedFairy = fairy")
        img.frame.absolute(v-if="selectedFairy?.id === fairy.id" src="/images/frames/frame-selected_128x128.png" :alt="`${fairy.name} frame selected`" class="h-16 scale-110")
        img.frame.absolute(v-else src="/images/frames/frame-normal_128x128.png" :alt="`${fairy.name} frame`" class="h-16 scale-110")
        div.flex.justify-center.items-center.h-full.w-full
          img(:src="fairy.avatar" :alt="`${fairy.name} image`" class="h-[60px] w-[60px]")
    img.absolute.right-6(src="/images/logo/Zora_logo_300x246.png" alt="logo"
      class="w-[100px] bottom-[12px]"
    )
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
