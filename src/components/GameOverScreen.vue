<template>
  <!--  <h1 class="font-bold text-xl text-red-600 absolute top-0 left-1/2">Zora</h1>-->
  <div class="battle-over-screen fixed top-0 left-0 w-full h-full z-[101]">
    <img
      class="absolute top-1 left-4 w-16 h-16 z-[102]"
      src="/images/logo/Zora_logo_512x512.png"
      alt="Zora logo"
    />
    <!--    <img-->
    <!--      class="absolute top-0 left-0 w-full h-full"-->
    <!--      src="../assets/documentation/promotion/loading_screen_ethereal_vistas_1280x720.jpg"-->
    <!--      alt="loading-screen-artwork"-->
    <!--    />-->
    <div class="flex flex-col justify-center items-center h-full flex-wrap">
      <h1 class="text-red-800 lg:text-[10rem] text-[5rem] shrink-0 text-center">GAME OVER</h1>
      <div class="flex w-full my-3">
        <div class="mx-auto">
          <div class="flex justify-center">
            <XButton
              class="with-bg leading-[1rem]"
              @click="backToMainMenu"
              @keydown.enter="backToMainMenu"
            >
              {{ t('backToMainMenu') }}
            </XButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import XButton from '@/components/atoms/XButton.vue'
import { cleanupLevel } from '@/Game.ts'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const route = useRoute()

/* if someone fled the game, $.fledGame = true */

const backToMainMenu = () => {
  cleanupLevel(false, true)
  setTimeout(() => {
    router.push({ name: 'main-menu', query: route.query })
  }, 100)
}
</script>

<style scoped lang="sass"></style>

<i18n>
en:
  backToMainMenu: "Back to Main Menu"
de:
  backToMainMenu: "Zurück zum Hauptmenü"
</i18n>
