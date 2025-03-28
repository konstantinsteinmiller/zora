<template>
  <div class="flex flex-col h-screen sm:h-full w-screen">
    <main
      class="game"
      :class="cssProps"
    >
      <router-view />
    </main>
    <img
      src="/images/cursor-icon.png"
      class="absolute cursor z-[999] pointer-events-none"
      alt="cursor"
    />
    <Tutorial />
  </div>
</template>

<script setup lang="ts">
import Tutorial from '@/components/Tutorial.vue'
import { computed } from 'vue'
import $ from '@/global'

/* reactivity transform example */
// let count = $ref(0)
// count++
// console.log(count)
const cssProps = computed(() => ({ 'cursor--hidden': !$.showCursor }))
</script>

<style scoped lang="sass">
#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>

<style lang="sass">
*
  cursor: none
body
  margin: 0
  display: flex
  place-items: center
  min-width: 320px
  min-height: 100vh
  overflow: hidden
  cursor: wait
  &.cursor--hidden
    cursor: none

  .cursor
    left: -50px
    top: -50px
    width: 32px
    height: 32px
    position: fixed
    transform: translate(-30%, -25%)
    &.cursor--hidden
      display: none
</style>
