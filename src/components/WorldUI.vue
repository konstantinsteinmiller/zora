<script setup lang="ts">
import FairyDustCollected from '@/components/atoms/FairyDustCollected.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import DispelInteraction from '@/components/molecules/DispelInteraction.vue'
import MessageManager from '@/components/molecules/MessageManager.vue'
import NameInteraction from '@/components/molecules/NameInteraction.vue'
import PauseMenu from '@/components/molecules/PauseMenu.vue'
import TalkInteraction from '@/components/molecules/TalkInteraction.vue'
import DialogBox from '@/components/organisms/DialogBox.vue'
import Menu from '@/components/organisms/Menu.vue'
import $ from '@/global'
import Game from '@/Game'
import useMatch from '@/use/useMatch.ts'
import { onMounted, type Ref, ref } from 'vue'
import addPerformanceStats from '@/utils/stats'
import { useRoute } from 'vue-router'

const route = useRoute()
useMatch()
const worldId: Ref<string> = ref(route.params.worldId)
const isBattlStarting: Ref<boolean> = ref(!!$?.isBattlStarting)

if ($.isDebug) {
  // addPerformanceStats()
}

const onLoadingFinished = () => {}

onMounted(async () => {
  await Game(worldId.value)

  // const updateUuid = $.addEvent('renderer.update', () => {
  //   if ($.isBattleStarting.value) {
  //     $.isBattleStarting.value = true
  //     $.removeEvent('renderer.update', updateUuid)
  //   }
  // })
})
</script>

<template>
  <canvas style="width: 100%; height: 100vh" />

  <DialogBox />

  <NameInteraction />
  <TalkInteraction />
  <DispelInteraction />

  <FairyDustCollected />
  <MessageManager />

  <LoadingScreen
    :level="worldId"
    @loading-finished="onLoadingFinished"
  />

  <Menu />
  <PauseMenu />
</template>

<style scoped lang="sass"></style>
