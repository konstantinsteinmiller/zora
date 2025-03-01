<template>
  <!--  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Zora</h1>-->
  <div
    v-if="isLoadingMap"
    class="loading-screen fixed top-0 left-0 w-full h-full z-[101]"
  >
    <img
      class="absolute top-1 left-4 w-16 h-16 z-[102]"
      src="/images/logo/Zora_logo_512x512.png"
      alt="Zora logo"
    />
    <img
      class="absolute top-0 left-0 w-full h-full"
      src="../assets/documentation/promotion/loading_screen_ethereal_vistas_1280x720.jpg"
      alt="loading-screen-artwork"
    />
    <ProgressBar
      :current="current"
      class="scale-150 left-12 bottom-12"
    />
  </div>
</template>

<script setup lang="ts">
import Arena from '@/Arena.ts'
import ProgressBar from '@/components/ProgressBar.vue'
import { soundToTrackSrcMap } from '@/engine/Sound.ts'
import { ZORA_TOTAL_LOAD_SIZE_NAME } from '@/enums/constants.ts'
import state from '@/states/GlobalState.ts'
import { AudioLoader, LoadingManager } from 'three'
import { onMounted, ref } from 'vue'

const isLoadingMap = ref(true)

const current = ref(85)
const loadingManager = new LoadingManager()
const audioLoader = new AudioLoader(loadingManager)

// Map to store progress per file, keyed by URL.
const fileProgressMap: Record<string, { loaded: number; total: number }> = {}

// Total bytes across all files (set when progress events arrive)
let overallTotal = +localStorage[ZORA_TOTAL_LOAD_SIZE_NAME] || 0
let backUpTotal = 0
let totalLoaded = 0
const isKnowingTotal = overallTotal > 0

// Called on each file's progress event.
const onFileProgress = (url: string, event: ProgressEvent<EventTarget>) => {
  // If total is not recorded yet, record it.
  if (!fileProgressMap[url]) {
    fileProgressMap[url] = { loaded: 0, total: event.total }
  }
  /* add total when files is completely loaded */
  if (event.loaded === event.total) {
    if (!isKnowingTotal) overallTotal += event.total
    backUpTotal += event.total
    totalLoaded += event.loaded
  }
  fileProgressMap[url].loaded = event.loaded

  current.value = overallTotal > 0 ? (totalLoaded / overallTotal) * 100 : 0
  // console.log(`Progress: ${current.value.toFixed(0)}%`)
}

const loadSounds = () => {
  const soundNamesList = Object.keys(soundToTrackSrcMap)

  const trackBuffersMap = state.sounds.trackBuffersMap
  if (!trackBuffersMap?.length) {
    soundNamesList.forEach((name: string) =>
      state.sounds.load(name, audioLoader, loadingManager, (event: any) => onFileProgress(name, event))
    )

    loadingManager.onLoad = () => {
      // console.log('%c All sound assets loaded', 'color: lightgrey', backUpTotal)
      setTimeout(() => {
        isLoadingMap.value = false
      }, 1000)
      localStorage.setItem(ZORA_TOTAL_LOAD_SIZE_NAME, backUpTotal.toString())
      if (state.isBattleOngoing) {
        state.sounds.play('background', { volume: 0.01, loop: true })
      }
    }
    return
  }
  // console.error('Sounds already loaded')
  isLoadingMap.value = false
}

onMounted(() => {
  /* add a one time event that will execute as soon as the Renderer is initialized
   * and the event will clean up after itself, so it just runs once */
  state.addOneTimeEvent('renderer.update', () => {
    loadSounds()
    /* load other assets */
    Arena()
  })
})
</script>

<style scoped lang="sass"></style>
