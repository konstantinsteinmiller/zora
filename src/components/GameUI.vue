<template>
  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Battler</h1>

  <canvas style="width: 100%; height: 100vh"></canvas>
</template>

<script setup lang="ts">
import Game from '@/Game'
import { onMounted } from 'vue'

onMounted(() => {
  const game = new Game()
})
</script>

<style scoped lang="sass"></style>
