<script setup lang="ts">
import { computed } from 'vue'
import $ from '@/global'

const name = computed(() => $.dialogSelf.value?.name)
</script>

<template lang="pug">
  div#name-interaction.billboard.card.pointer-events-none.origin-top-center.flex(class="w-fit !fixed z-[5] translate-x-[-50%] translate-y-[-50%]" style="left:0; right:0")
    div.w-full.h-full.text-white(class="text-[1rem]" style="text-shadow: 0 0 1px black") {{ name }}
</template>

<style scoped lang="sass"></style>
