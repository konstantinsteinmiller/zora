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
          class="flex flex-row justify-between items-center w-full"
        >
          <h5 class="text-l">{{ t(item.name) }}</h5>
          <div class="flex justify-start items-start">
            <input
              v-if="item.type === 'range'"
              v-model="item.value"
              type="range"
              class="text-red-700 w-48"
              :style="`--range-value:${item.value}`"
              @input="onInput(item.name, item.value)"
            />
            <XSelect
              v-if="item.type === 'select' && item.items"
              v-model="item.value"
              :items="item.items"
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
import { useI18n } from 'vue-i18n'
import VModal from '@/components/atoms/VModal.vue'
import useUser from '@/use/useUser'
import { computed, ref, watch } from 'vue'
import XButton from '@/components/atoms/XButton.vue'
import { LANGUAGES } from '@/utils/enums'
import XSelect from '@/components/atoms/XSelect.vue'

const { t }: any = useI18n({ useScope: 'local' })
const { locale }: any = useI18n({ useScope: 'global' })
const { userSoundVolume, userMusicVolume, userLanguage, setSettingValue } = useUser()

defineProps({
  show: Boolean,
})
const emit = defineEmits(['close'])

watch(userLanguage, (newValue: string) => {
  locale.value = newValue
})

const onInput = (name: string, newVolume: any) => {
  setSettingValue(name, newVolume)
}

const languagesList = computed(() => {
  return LANGUAGES.map((locale: string) => ({
    value: locale,
    label: `${t(locale)} (${locale})`,
    locale: userLanguage.value,
  }))
})

const itemsList = ref([
  {
    name: 'gameSound',
    type: 'range',
    value: userSoundVolume,
  },
  {
    name: 'music',
    type: 'range',
    value: userMusicVolume,
  },
  {
    name: 'language',
    type: 'select',
    value: userLanguage,
    items: languagesList,
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
  gameSound: "Game Sound"
  music: "Music"
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
  gameSound: "Sound"
  music: "Musik"
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
