<template>
  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Battler</h1>

  <canvas style="width: 100%; height: 100vh"></canvas>
  <StatBar
    owner-id="enemy"
    type="life"
  />
  <StatBar
    owner-id="player"
    type="life"
  />
  <StatBar
    owner-id="player"
    type="mana"
  />
  <StatBar
    owner-id="player"
    type="endurance"
  />
</template>

<script setup lang="ts">
import StatBar from '@/components/StatBar.vue'
// import DEBUGGAME from '@/components/DEBUGGAME.ts'
import Game from '@/Game'
import { onMounted } from 'vue'

onMounted(() => {
  Game()
  // DEBUGGAME()
})
</script>

<style scoped lang="sass"></style>
