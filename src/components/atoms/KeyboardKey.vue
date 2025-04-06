<script setup lang="ts">
import { KeyboardKeysMap } from '@/control/KeyboardController.ts'
import { useKeyboard } from '@/use/useKeyboard.ts'
import { computed, type ComputedRef } from 'vue'
import LeftMouseImg from '@/assets/images/input/mouse_left_outline.png'
import RightMouseImg from '@/assets/images/input/mouse_right_outline.png'

const props = defineProps({
  k: {
    type: String,
    required: true,
  },
  activated: {
    type: Boolean,
    default: false,
  },
  allowActivation: {
    type: Boolean,
    default: false,
  },
})

const displayedKey: string = KeyboardKeysMap[props.k]
const { activatedKeysMap } = useKeyboard()
const isActivated: ComputedRef<boolean> = computed(() => activatedKeysMap.value[props.k])
const isMouseKey: ComputedRef<boolean> = computed(() => props.k === 'Mouse0' || props.k === 'Mouse2')
</script>

<template lang="pug">
  .key.inline-block.rounded-md.w-8.h-8.flex.justify-center.items-center(class="border-[2px]",
    :class="{ 'bg-green-800': isActivated && !isMouseKey,  'border-white' : !isMouseKey,  'border-transparent' : isMouseKey }"
    )
    .inner.box-content.rounded-md(v-if="k === 'Mouse0'",
      :class="{ 'bg-green-800': isActivated && isMouseKey }")
      img.w-8.h-8(
        :src="LeftMouseImg"
        alt="left mouse button"
      )
    .inner.box-content.rounded-md(v-else-if="k === 'Mouse2'",
      :class="{ 'bg-green-800': isActivated && isMouseKey }")
      img.w-8.h-8(
        :src="RightMouseImg"
        alt="right mouse button"
      )
    .inner(v-else) {{ displayedKey }}
</template>

<style scoped lang="sass"></style>
