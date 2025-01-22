<script setup lang="ts">
// import { ref } from 'vue'

// defineProps<{ msg: string }>()

// const count = ref(0)
const test = () => {
  console.log('test')
  return 'BLUB'
}
</script>

<template>
  <h1 class="font-bold text-xl text-red-600">Tailwind + Vue + Vite + Eslint {{ test() }}</h1>
</template>

<style scoped lang="sass"></style>
