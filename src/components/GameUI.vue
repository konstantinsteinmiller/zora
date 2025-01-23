<template>
  <h1 class="font-bold text-xl text-red-600">Battler</h1>

  <canvas style="width: 100%; height: 95vh"></canvas>
</template>

<script setup lang="ts">
import Game from '@/Game'

const game = new Game()
</script>

<style scoped lang="sass"></style>
