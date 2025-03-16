<template>
  <!--  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Zora</h1>-->
  <div
    v-if="isLoading"
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
    <!--    show-percentage-->
  </div>
</template>

<script setup lang="ts">
import Arena from '@/Arena.ts'
import ProgressBar from '@/components/ProgressBar.vue'
import FileLoader from '@/engine/FileLoader.ts'
import state from '@/states/GlobalState.ts'
import useUser from '@/use/useUser.ts'
import { type ComputedRef, onMounted } from 'vue'

const emit = defineEmits(['loading-finished'])

const { userMusicVolume } = useUser()
const fileLoader = FileLoader()
let isLoading: ComputedRef<boolean> | boolean = fileLoader.isLoading
let current: ComputedRef<number> | number = fileLoader.currentlyLoadedPercent

onMounted(() => {
  /* add a one time event, that will execute as soon as the Renderer is initialized
   * and the event will clean up after itself, so it just runs once */
  state.addOneTimeEvent('renderer.update', () => {
    state.fileLoader.loadData(() => {
      const character = state.player
      character.start()

      // const enemy = state.enemy
      // enemy.start() // already started in the Arena loop

      if (state.isBattleInitialized) {
        emit('loading-finished')

        state.controls.setPointerLock()

        state.sounds.stop('background')
        state.sounds.play('battle', { volume: 0.25 * userMusicVolume.value * 0.25, loop: true })
      }
    })

    /* load other assets */
    state.sounds.loadSounds()
    Arena()
  })
})
</script>

<style scoped lang="sass"></style>
