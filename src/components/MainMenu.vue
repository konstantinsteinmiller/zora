<script setup lang="ts">
import { spraySprincles } from '@/control/KeyboardController.ts'
import Camera from '@/engine/Camera.ts'
import FileLoader from '@/engine/FileLoader.ts'
import Sound from '@/engine/Sound.ts'
import router from '@/router'
import state from '@/states/GlobalState.ts'
import { findPointer, onUnlockedMouseMove, showCustomPointer } from '@/utils/find-pointer.ts'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OptionsModal from '@/components/OptionsModal.vue'
import XButton from '@/components/atoms/XButton.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { t } = useI18n()
const isOptionsModalOpen = ref(false)
const isNative = import.meta.env.VITE_PLATTFORM === 'native'

showCustomPointer()

const startGame = () => {
  router.push({ name: 'game', query: route.query })
}

const onExit = () => {
  console.log('exit game')
}

const setPointer = async () => {
  const { clientX, clientY }: any = await findPointer()
  onUnlockedMouseMove({ clientX, clientY })
}
setPointer()

!state.sounds && Sound()
state.sounds.playBackgroundMusic()

!state.fileLoader && FileLoader()
!state.camera && Camera()

const game$: any = document.querySelector('.game')
onMounted(() => {
  game$.addEventListener('click', (e: MouseEvent) => spraySprincles(e), false)
  game$.addEventListener('mousemove', onUnlockedMouseMove, false)
})
onUnmounted(() => {
  game$.removeEventListener('click', (e: MouseEvent) => spraySprincles(e), false)
  game$.removeEventListener('mousemove', onUnlockedMouseMove, false)
})
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-full">
    <img
      class="absolute top-0 left-0 w-full h-full"
      src="@/assets/documentation/promotion/loading_screen_ethereal_vistas_1280x720.jpg"
      alt="loading-screen-artwork"
    />

    <div class="relative top-0 left-0 bg-[#050505] flex justify-center items-start w-full h-[200px]">
      <img
        class="w-[700px] h-[200px] z-[5]"
        src="@/assets/documentation/Zora_banner_1331x430.jpg"
        alt="Zora logo"
      />
    </div>

    <div class="flex w-full my-3 mt-1">
      <div class="mx-auto">
        <div class="flex justify-center">
          <XButton
            class="with-bg mt-3 leading-[1rem]"
            @click="startGame"
            @keydown.enter="startGame"
          >
            {{ t('startGame') }}
          </XButton>
        </div>

        <div class="flex justify-center">
          <XButton
            class="mt-3 with-bg"
            @click="() => (isOptionsModalOpen = true)"
            >{{ t('options') }}
          </XButton>
        </div>

        <OptionsModal
          :show="isOptionsModalOpen"
          @close="() => (isOptionsModalOpen = false)"
        />

        <div
          v-if="isNative"
          class="flex justify-center"
        >
          <XButton
            class="mt-3 with-bg"
            @click="onExit"
            >{{ t('quit') }}
          </XButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass"></style>

<i18n>
en:
  startGame: "Start Game"
  options: "Options"
  quit: "Quit game"
de:
  startGame: "Spiel Starten"
  options: "Einstellungen"
  quit: "Spiel beenden"
</i18n>
