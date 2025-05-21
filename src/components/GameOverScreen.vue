<script setup lang="ts">
import XButton from '@/components/atoms/XButton.vue'
import { cleanupLevel } from '@/Game'
import router from '@/router'
import $ from '@/global'
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
const backToWorld = () => {
  cleanupLevel(false, true)
  setTimeout(() => {
    router.push({
      name: 'world',
      params: {
        worldId: $.world?.level.value?.zone,
      },
      query: route.query,
    })
  }, 100)
}
</script>

<template>
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
              v-if="!$?.world?.playerRef || route.query.test === 'arena'"
              class="with-bg leading-[1rem]"
              @click="backToMainMenu"
              @keydown.enter="backToMainMenu"
            >
              {{ t('backToMainMenu') }}
            </XButton>
            <XButton
              v-else
              class="with-bg leading-[1rem]"
              @click="backToWorld"
              @keydown.enter="backToWorld"
              @keydown.esc="backToWorld"
            >
              {{ t('continue') }}
            </XButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass"></style>
