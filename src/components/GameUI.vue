<template>
  <!--  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Zora</h1>-->

  <canvas style="width: 100%; height: 100vh" />
  <template v-if="!isBattleOver">
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
  <template v-else>
    <GameOverScreen v-if="hasOneTeamLost" />
  </template>

  <LoadingScreen @loading-finished="onLoadingFinished" />
  <div class="find-pointer w-full h-full absolute top-0 left-0"></div>
</template>

<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue'
import GameOverScreen from '@/components/GameOverScreen.vue'
import StatBar from '@/components/StatBar.vue'
import state from '@/states/GlobalState'
import Game from '@/Game'
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isBattleOver: Ref<boolean> = ref(false)
const hasOneTeamLost: Ref<boolean> = ref(false)
state.isDebug = route.query.debug === 'true'

const onLoadingFinished = () => {}

onMounted(async () => {
  await Game()

  const updateUuid = state.addEvent('renderer.update', () => {
    if (state?.isBattleOver) {
      isBattleOver.value = true
      ;[state.player, state.enemy].some(team => {
        if (team.isDead(team)) {
          hasOneTeamLost.value = true
          return true
        }
      })
      state.removeEvent('renderer.update', updateUuid)
    }
  })
})
</script>

<style scoped lang="sass"></style>
