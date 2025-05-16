<script setup lang="ts">
import $ from '@/global.ts'
import useMatch from '@/use/useMatch.ts'
import useUser from '@/use/useUser.ts'
import { LEVELS } from '@/utils/enums.ts'
import { useI18n } from 'vue-i18n'
import VModal from '@/components/atoms/VModal.vue'
import XButton from '@/components/atoms/XButton.vue'

const { t }: any = useI18n({ useScope: 'local' })
const { isOptionsModalOpen } = useUser()

const emit = defineEmits(['close'])

const onClose = () => {
  $.isPauseMenu.value = false
}

const onContinue = () => {
  onClose()
  $.isPaused = false
}
const onOptions = () => {
  // onContinue()
  isOptionsModalOpen.value = true
}

const onExit = () => {
  onClose()
  window.location.reload()
}
const isNative = import.meta.env.VITE_PLATTFORM === 'native'
const { levelType } = useMatch()
</script>

<template lang="pug">
  VModal(
    :show="$.isPauseMenu.value"
    :is-dialog="true"
    class="card glass dark"
    @close="onClose"
  )
    template(#title)
      h1.mb-2.text-2xl {{ t('title') }}
    template(#description)
      div.w-full.max-w-80.flex.flex-col.justify-between.items-center.gap-3.my-2
        XButton(@click="onContinue") {{ t('continue') }}
        template(v-if="levelType === LEVELS.WORLD")
          XButton(@click="onContinue") {{ t('saveGame') }}
          XButton(@click="onContinue") {{ t('loadGame') }}
        XButton(@click="onOptions") {{ t('options') }}
        XButton(@click="onExit") {{ t('backToMainMenu') }}
        XButton(v-if="isNative" @click="onExit") {{ t('exit') }}
</template>

<style scoped lang="scss"></style>

<i18n>
en:
  title: "Options"
  saveGame: "Save Game"
  loadGame: "Load Game"
de:
  title: "Einstellungen"
  saveGame: "Spiel speichern"
  loadGame: "Spiel laden"
</i18n>
