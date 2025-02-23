<template>
  <!--  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Zora</h1>-->

  <canvas style="width: 100%; height: 100vh"></canvas>
  <img
    class="absolute top-1 left-4 w-16 h-16"
    src="/images/logo/Zora_logo_512x512.png"
    alt="Zora logo"
  />
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
import Game from '@/Game'
import { onMounted } from 'vue'

onMounted(() => {
  Game()
})
</script>

<style scoped lang="sass"></style>
