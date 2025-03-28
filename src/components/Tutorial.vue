<script setup lang="ts">
import TutorialPopover from '@/components/TutorialPopover.vue'
import CharacterControl from '@/components/tutorials/CharacterControl.vue'
import MissingMana from '@/components/tutorials/MissingMana.vue'
import useUser from '@/use/useUser'
import { TUTORIALS } from '@/utils/enums.ts'
import { computed, type Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { tutorialPhase, userTutorialsDoneMap, setSettingValue } = useUser()
// tutorialPhase.value = TUTORIALS.CHARACTER_CONTROLS
// tutorialPhase.value = TUTORIALS.MISSING_MANA
const enableTutorial = ref(true)
const tutorialPhasesList = [TUTORIALS.CHARACTER_CONTROLS, TUTORIALS.MISSING_MANA, 'gameplay']
const isTutorialPopoverOpen: Ref<boolean> = computed(() => {
  return enableTutorial.value && tutorialPhasesList.includes(tutorialPhase.value)
})

const isTutorialPhaseDone = computed(() => !enableTutorial.value || !!userTutorialsDoneMap.value[tutorialPhase.value])
const onClose = () => {
  if (typeof userTutorialsDoneMap.value === 'string') {
    userTutorialsDoneMap.value = JSON.parse(userTutorialsDoneMap.value)
  }
  userTutorialsDoneMap.value[tutorialPhase.value] = true
  setSettingValue('tutorialsDoneMap', JSON.stringify(userTutorialsDoneMap.value))
  tutorialPhase.value = ''
}

// tutorialPhase.value = 'test'
setTimeout(() => {
  enableTutorial.value = true
}, 1000)
</script>

<template lang="pug">
  TutorialPopover(v-if="!isTutorialPhaseDone && isTutorialPopoverOpen" bottom="12" right="8" @close="onClose")
    CharacterControl(v-if="tutorialPhase === TUTORIALS.CHARACTER_CONTROLS" :header="t('characterControls')" @done="onClose")
    MissingMana(v-if="tutorialPhase === TUTORIALS.MISSING_MANA" :header="t('missingMana')" @done="onClose")
</template>

<i18n>
en:
  tutorial: "Tutorial"
  characterControls: "Controls"
  missingMana: "Missing Mana"
de:
  tutorial: "Tutorial"
  characterControls: "Steuerung"
  missingMana: "Fehlendes Mana"
</i18n>
