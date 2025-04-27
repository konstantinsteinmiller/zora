<script setup lang="ts">
import { ELEMENTS } from '@/utils/enums.ts'
import { prependBaseUrl } from '@/utils/function.ts'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const typeToImgMap = Object.values(ELEMENTS).reduce((acc, ele) => {
  acc[ele] = prependBaseUrl(`/images/element-icons/${ele}_128x128.png`)
  return acc
}, {})
</script>

<template lang="pug">
  img.inline-block.w-6.h-6(:src="typeToImgMap[type]" alt="element icon" class="")
</template>

<style scoped lang="sass"></style>
