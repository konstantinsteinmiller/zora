<script setup lang="ts">
import FairySpellDetail from '@/components/molecules/FairySpellDetail.vue'
import $ from '@/global.ts'
import type { AttackSpell, Spell } from '@/types/spells.ts'
import useMenu from '@/use/useDraggable.ts'
import { ref } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  fairy: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

const fairySpellsList = ref<(Spell | AttackSpell)[]>([
  props.fairy.spells[0],
  props.fairy.passiveSpells[1],
  props.fairy.spells[0],
  props.fairy.passiveSpells[1],
])
console.log('fairySpellsList: ', fairySpellsList.value)
const { onDragStartSpell, onEndSpell, onDropSpell } = useMenu(fairySpellsList, 'fairy-spells-list')
</script>

<template lang="pug">
  div.fairy-spells.flex.flex-row.relative.w-full.h-24.items-center.justify-start
    img.fancy-frame.absolute.top-0.left-0(
      src="/images/frames/fancy-frame_512x128.png" alt="frame"
      class="h-32 w-[436px]"
    )
    div.ml-2.relative
      div.absolute.top-0.left-2.text-blue-500.text-lg(
        class="!text-[14px] !font-bold !text-center translate-y-[14px]"
        style="text-shadow: 0 0 8px #ffffffff;"
      ) {{ index + 1 }}.
      img.normal-frame.absolute.top-0.left-0(
        src="/images/frames/frame-avatar_128x144.png" alt="frame"
        class="h-[72px] w-[72px] ml-2 mt-5"
      )
      div.absolute.-bottom-4(class="left-11 translate-x-[-50%]") {{ fairy.name }}
      img.self-start.w-auto.rounded-full(v-if="fairy?.avatar"
        :src="fairy.avatar" :alt="`${fairy.name} image`"
        class="h-[64px] w-[64px] ml-3 mt-7"
      )
    div.flex.justify-center.gap-1(class="ml-4")
      draggable(
        v-model="fairySpellsList"
        group="spells"
        item-key="name"
        draggable=".fairy-spell-detail"
        ghost-class="fairy-spell-detail"
        @start="onDragStartSpell"
        @end="onEndSpell"
        @change="onDropSpell"
        class="fairy-spells-list flex"
      )
        template(v-slot:item="{ element, index }")
          FairySpellDetail(
            class="draggable cursor-grab"
            :spell="element" :key="index"
            :index="index"
            :data-index="index"
          )
</template>

<style scoped lang="sass"></style>
