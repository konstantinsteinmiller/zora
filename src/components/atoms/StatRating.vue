<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps({
  amount: {
    type: Number,
    required: true,
  },
})

const dots = computed(() => props.amount)
const amountsList = computed(() => [...Array(dots.value)])
const missingList = computed(() => [...Array(5 - dots.value)])
</script>

<template lang="pug">
  div.flex.gap-1.items-center
    div.dots.rounded-full.w-3.h-3.border.border-gray-400.border-solid(
      v-for="(dot, dotIndex) in amountsList" :key="`dot-${dotIndex}`"
      style="background: radial-gradient(90deg, #E1DA1ACF 0%, E1DA1ACF 100%);"
    )
    //img.pointer-events-none.w-4.h-4(
    //  src="/images/icons/fairy.png"
    //  v-for="(dot, dotIndex) in amountsList" :key="`dot-${dotIndex}`"
    //  alt="cursor"
    //)
    div.rounded-full.w-3.h-3.border.border-gray-400.border-solid(
      v-for="(dot, dotIndex) in missingList" :key="`cleardot-${dotIndex}`"
      class="bg-gray-100"
    )
</template>

<style scoped lang="sass">
.dots
  background: radial-gradient(60px circle at 0 0, rgb(255, 223, 0), transparent 90%)
</style>
