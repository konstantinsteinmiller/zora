<template>
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

    <BuffsList />
  </template>
  <template v-else>
    <GameOverScreen v-if="hasOneTeamLost || fledGame" />
  </template>

  <DamageNumber />
  <LoadingScreen :level="worldId" />
</template>

<script setup lang="ts">
import DamageNumber from '@/components/atoms/DamageNumber.vue'
import BuffsList from '@/components/molecules/BuffsList.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import GameOverScreen from '@/components/GameOverScreen.vue'
import StatBar from '@/components/StatBar.vue'
import $ from '@/global'
import Game from '@/Game'
import useMatch from '@/use/useMatch.ts'
import { onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import addPerformanceStats from '@/utils/stats'

useMatch()
const route = useRoute()

const worldId: Ref<string> = ref(route.params.worldId)

const isBattleOver: Ref<boolean> = ref(!!$?.isBattleOver)
const hasOneTeamLost: Ref<boolean> = ref(false)
const fledGame: Ref<boolean> = ref(false)

if ($.isDebug) {
  // addPerformanceStats()
}

onMounted(async () => {
  await Game(worldId.value)

  const updateUuid = $.addEvent('renderer.update', () => {
    if ($?.isBattleOver) {
      isBattleOver.value = true
      if (!$.enemy || !$.player) {
        hasOneTeamLost.value = true
      }
      ;[$.player, $.enemy].some(team => {
        if (team?.isDead(team)) {
          hasOneTeamLost.value = true
          return true
        }
      })

      fledGame.value = $.fledGame
      $.removeEvent('renderer.update', updateUuid)
    }
  })
})
</script>

<style scoped lang="sass"></style>
