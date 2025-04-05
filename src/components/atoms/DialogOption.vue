<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})
</script>

<template lang="pug">
  div.text-white.text-xl.py-1(
    :class="{'text-yellow-300': isSelected}"
    style='text-shadow: 1px 1px 2px #26399a, 0px 0px 3px black'
    :style={
      'text-shadow: 1px 1px 4px 5px black': true
    }) {{ text }}
</template>

<style scoped lang="sass"></style>
