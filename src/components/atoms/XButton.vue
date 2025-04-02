<template>
  <button
    :class="{
      'glass select-none': true,
      '!cursor-none': IS_ZORA,
    }"
    tabindex="0"
    @click="emits('click', $event)"
  >
    <slot name="default">
      <span>{{ label }}</span>
    </slot>

    <div class="button-bg absolute top-0 left-0 rounded-3xl bg-transparent opacity-30 inset-0 -z-20" />
  </button>
</template>

<script setup lang="ts">
import { IS_ZORA } from '@/utils/constants.ts'

defineProps({
  label: {
    type: String,
    default: '',
  },
})
const emits = defineEmits(['click'])
</script>
