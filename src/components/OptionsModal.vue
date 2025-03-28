<template>
  <VModal
    v-if="show"
    @close="onClose"
  >
    <template #title>
      <h1 class="mb-2 text-2xl">{{ t('title') }}</h1>
    </template>
    <template #description>
      <div class="w-full max-w-80 flex flex-col justify-between items-center gap-3">
        <div
          v-for="(item, index) in itemsList"
          :key="index"
          class="grid grid-cols-3 w-full"
        >
          <h5 class="text-l flex items-center justify-center">{{ t(item.name) }}</h5>
          <div class="flex justify-start items-center col-span-2 w-full flex-grow">
            <input
              v-if="item.type === 'range'"
              v-model="item.value"
              min="0"
              max="1"
              step="0.01"
              type="range"
              class="text-red-700 w-full"
              :style="`--range-value:${item.value}`"
              @input="onInput(item.name, item.value)"
            />
            <XSelect
              v-if="item.type === 'select' && item.items"
              v-model="item.value"
              :items="item.items"
              @change="onInput(item.name, item.value)"
            />
            <XSwitch
              v-if="item.type === 'switch'"
              v-model="item.value"
              :title="item.title"
              class="w-full"
              @change="onInput(item.name, item.value)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #buttons>
      <div class="mt-6"></div>
      <XButton @click="onClose">{{ t('close') }}</XButton>
    </template>
  </VModal>
</template>

<script setup lang="ts">
import XSwitch from '@/components/atoms/XSwitch.vue'
import { useI18n } from 'vue-i18n'
import VModal from '@/components/atoms/VModal.vue'
import useUser from '@/use/useUser'
import { computed, ref, watch } from 'vue'
import XButton from '@/components/atoms/XButton.vue'
import { LANGUAGES } from '@/utils/enums'
import XSelect from '@/components/atoms/XSelect.vue'

const { t }: any = useI18n({ useScope: 'local' })
const { locale }: any = useI18n({ useScope: 'global' })
const { userSoundVolume, userMusicVolume, userLanguage, allowTutorial, setSettingValue } = useUser()

defineProps({
  show: Boolean,
})
const emit = defineEmits(['close'])

watch(userLanguage, (newValue: string) => {
  locale.value = newValue
})
const onInput = (name: string, newValue: any) => {
  if (name === 'tutorial') {
    allowTutorial.value = newValue
    newValue && setSettingValue('tutorialsDoneMap', { none: true })
    return
  }
  setSettingValue(name, newValue)
}

const allowTutorialCRef: any = computed(() => t('allowTutorial'))

const languagesList = computed(() => {
  return LANGUAGES.map((locale: string) => ({
    value: locale,
    label: `${t(locale)} (${locale})`,
    locale: userLanguage.value,
  }))
})

const itemsList = ref([
  {
    name: 'soundVolume',
    type: 'range',
    value: userSoundVolume,
  },
  {
    name: 'musicVolume',
    type: 'range',
    value: userMusicVolume,
  },
  {
    name: 'language',
    type: 'select',
    value: userLanguage,
    items: languagesList,
  },
  {
    name: 'tutorial',
    type: 'switch',
    value: allowTutorial,
    title: allowTutorialCRef,
  },
])
const onClose = () => {
  // isOptionsModalOpen.value = !isOptionsModalOpen.value
  emit('close')
}
</script>

<style scoped lang="scss"></style>

<i18n>
en:
  title: "Options"
  soundVolume: "Game Sound"
  musicVolume: "Music"
  tutorial: "Tutorial"
  allowTutorial: "Reset Tutorial"
  language: "Language"
  en: "English"
  de: "German"
  fr: "French"
  es: "Spanish"
  it: "Italian"
  jp: "Japan"
  kr: "Korean"
  pl: "Polish"
  nl: "Dutch"
  pt: "Portuguese"
  zh: "Chinese"
  ru: "Russian"
  cs: "Czech"
  el: "Greek"
  da: "Danish"
  fi: "Finnish"
  sv: "Swedish"
  ms: "Malay"
  ar: "Arabic"
de:
  title: "Einstellungen"
  soundVolume: "Sound"
  musicVolume: "Musik"
  tutorial: "Tutorial"
  allowTutorial: "Tutorial zurücksetzen"
  language: "Sprache"
  en: "Englisch"
  de: "Deutsch"
  fr: "Französisch"
  es: "Spanisch"
  it: "Italienisch"
  jp: "Japanisch"
  kr: "Koreanisch"
  pl: "Polnisch"
  nl: "Niederländisch"
  pt: "Portugiesisch"
  zh: "Chinesisch"
  ru: "Russisch"
  cs: "Tschechisch"
  el: "Griechisch"
  da: "Dänisch"
  fi: "Finnisch"
  sv: "Schwedisch"
  ms: "Malaiisch"
  ar: "Arabisch"
</i18n>
