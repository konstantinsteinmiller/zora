<script setup lang="ts">
import LoadingBar from '@/components/LoadingBar.vue'
import MessageManager from '@/components/molecules/MessageManager.vue'
import { spraySprincles } from '@/control/KeyboardController.ts'
import Camera from '@/engine/Camera.ts'
import FileLoader from '@/engine/FileLoader.ts'
import Sound from '@/engine/Sound.ts'
import router from '@/router'
import $ from '@/global'
import useAssets from '@/use/useAssets.ts'
import useMatch from '@/use/useMatch.ts'
import { findPointer, onUnlockedMouseMove, showCustomPointer } from '@/utils/find-pointer.ts'
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import OptionsModal from '@/components/OptionsModal.vue'
import TutorialPopover from '@/components/TutorialPopover.vue'
import XButton from '@/components/atoms/XButton.vue'
import Menu from '@/components/organisms/Menu.vue'
import { useRoute } from 'vue-router'

const { isStartingGame } = useMatch()
const route = useRoute()
$.route.value = route

const { t } = useI18n()
const isOptionsModalOpen = ref(false)
const isNative = import.meta.env.VITE_PLATTFORM === 'native'

showCustomPointer()

const startArena = () => {
  isStartingGame.value = true
  router.push({ name: 'battle', params: { worldId: 'water-arena' }, query: route.query })
}

const startWorld = () => {
  isStartingGame.value = true
  router.push({ name: 'world', params: { worldId: 'city-1' }, query: route.query })
}

const onExit = () => {
  console.log('exit game')
}

const setPointer = async () => {
  const { clientX, clientY }: any = await findPointer()
  onUnlockedMouseMove({ clientX, clientY })
}
setPointer()

!$.sounds && Sound()

!$.fileLoader && FileLoader()
!$.camera && Camera()

const { preloadAssets, loadingProgress, worldLoadingProgress } = useAssets()

const game$: any = document.querySelector('.game')

let onceBackgroundMusic = false
const onClick = (e: MouseEvent) => {
  if ($.sounds && !onceBackgroundMusic) {
    $.sounds.playBackgroundMusic()
    onceBackgroundMusic = true
  }
  spraySprincles(e)
}

onMounted(() => {
  preloadAssets()
  game$.addEventListener('click', onClick, false)
  game$.addEventListener('mousemove', onUnlockedMouseMove, false)
})
onUnmounted(() => {
  game$.removeEventListener('click', onClick, false)
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
            :disabled="loadingProgress < 99.8"
            @click="startArena"
            @keydown.enter="startArena"
          >
            {{ t('startArena') }}
          </XButton>
        </div>

        <div class="flex justify-center">
          <XButton
            class="with-bg mt-3 leading-[1rem]"
            :disabled="worldLoadingProgress < 99.8"
            @click="startWorld"
            @keydown.enter="startWorld"
          >
            {{ t('startWorld') }}
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
    <LoadingBar />

    <Menu v-if="$.isDebug" />
  </div>
</template>

<i18n>
en:
  startGame: "Start Game"
  startArena: "Start Arena"
  startWorld: "Start World"
  options: "Options"
  quit: "Quit game"
de:
  startGame: "Spiel Starten"
  startArena: "Arena Starten"
  startWorld: "Welt Starten"
  options: "Einstellungen"
  quit: "Spiel beenden"
</i18n>
