<script setup lang="ts">
import Key from '@/components/atoms/KeyboardKey.vue'
</script>

<template lang="pug">
  div#talk-interaction.billboard.glass.card.p-2.pointer-events-none.origin-top-center.flex(class="w-fit !fixed z-[5] translate-x-[-50%]" style="left:0; right:0")
    div.gap-2.flex.items-center.p-2.text-white.text-xl.flex-shrink-1.w-fit(style="text-shadow: 0 0 5px black")
      Key(k="KeyF")
      | Talk
</template>

<style scoped lang="sass"></style>
