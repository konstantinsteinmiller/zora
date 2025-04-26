<script setup lang="ts">
// import natureImg from '/images/element-icons/nature_128x128.png'
// import waterImg from '/images/element-icons/water_128x128.png'
// import airImg from '/images/element-icons/air_128x128.png'
// import lightImg from '/images/element-icons/light_128x128.png'
// import energyImg from '/images/element-icons/energy_128x128.png'
// import psiImg from '/images/element-icons/psi_128x128.png'
// import earthImg from '/images/element-icons/earth_128x128.png'
// import iceImg from '/images/element-icons/ice_128x128.png'
// import fireImg from '/images/element-icons/fire_128x128.png'
// import darkImg from '/images/element-icons/dark_128x128.png'
// import metalImg from '/images/element-icons/metal_128x128.png'
// import neutralImg from '/images/element-icons/neutral_128x128.png'
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
