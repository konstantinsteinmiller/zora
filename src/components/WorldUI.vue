<template>
  <canvas style="width: 100%; height: 100vh" />

  <LoadingScreen
    :level="worldId"
    @loading-finished="onLoadingFinished"
  />
  <div class="find-pointer w-full h-full absolute top-0 left-0"></div>
</template>

<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue'
import $ from '@/global'
import Game from '@/Game'
import useMatch from '@/use/useMatch.ts'
import { onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
import addPerformanceStats from '@/utils/stats'

useMatch()
const route = useRoute()
const worldId: Ref<string> = ref(route.params.worldId)
const isBattlStarting: Ref<boolean> = ref(!!$?.isBattlStarting)
$.isDebug = route.query.debug === 'true' || localStorage.getItem('debug') === 'true'

if ($.isDebug) {
  // addPerformanceStats()
}

const onLoadingFinished = () => {}

onMounted(async () => {
  await Game(worldId.value)

  // const updateUuid = $.addEvent('renderer.update', () => {
  //   if ($?.isBattleStarting) {
  //     $.isBattleStarting.value = true
  //     $.removeEvent('renderer.update', updateUuid)
  //   }
  // })
})
</script>

<style scoped lang="sass"></style>
