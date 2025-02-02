<template>
  <div class="flex flex-col h-screen sm:h-full">
    <main
      class="game"
      :class="cssProps"
    >
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/* reactivity transform example */
// let count = $ref(0)
// count++
// console.log(count)
const cssProps = computed(() => ({ 'cursor--hidden': !window.showCursor }))
</script>

<style scoped lang="sass">
#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

.game
  cursor: auto
  &.cursor--hidden
    cursor: none
</style>

<style lang="sass">
body
  margin: 0
  display: flex
  place-items: center
  min-width: 320px
  min-height: 100vh
</style>
