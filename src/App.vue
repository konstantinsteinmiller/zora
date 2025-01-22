<template>
  <div class="flex flex-col h-screen sm:h-full">
    <main><router-view /></main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="sass">
#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

body
  margin: 0
  display: flex
  place-items: center
  min-width: 320px
  min-height: 100vh

//.logo
//  height: 6em
//  padding: 1.5em
//  will-change: filter
//  transition: filter 300ms
//.logo:hover
//  filter: drop-shadow(0 0 2em #646cffaa)
//.logo.vue:hover
//  filter: drop-shadow(0 0 2em #42b883aa)
</style>
