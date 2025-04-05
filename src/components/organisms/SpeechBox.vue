<script setup lang="ts">
import { BASE_DIALOG_DURATION, dialogTextSpeed } from '@/utils/constants.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { computed, type ComputedRef, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import $, { getNpc } from '@/global'

interface SpeechOption {
  id?: string
  text: string
  speech: string
}

const props = defineProps({
  dialog: {
    type: Array<SpeechOption>,
    default: () => [{ text: '', speech: '' }],
  },
})

$.dialogSelf = getNpc('flf_trader') /* FIX ME make it dynamic */
const self: any = $.dialogSelf

const { t } = useI18n()
const emit = defineEmits(['finish'])
const dialogLinesList = ref<SpeechOption[]>(JSON.parse(JSON.stringify(props.dialog)))
const currentLine = ref('')
const currentSpeech = ref('')
const dialogScale = ref(0.5) // Initial scale
const audioFiles = ref<Map<string, HTMLAudioElement>>(new Map()) // Map to store audio files

const DialogDuration: ComputedRef<number> = computed(() => {
  const audio = audioFiles.value.get(currentSpeech.value)
  if (audio) {
    return audio.duration * 1000 // Audio duration in milliseconds
  }
  return BASE_DIALOG_DURATION + currentLine.value.length * dialogTextSpeed.value
})

const isPlayerTalking: ref<boolean> = ref(false)

let nextLineTimeout: any
let appearTimeout: any
let currentAudio: HTMLAudioElement | null = null

const preloadAudioFiles = async () => {
  if (dialogLinesList.value) {
    for (const line of dialogLinesList.value) {
      if (line.speech && !audioFiles.value.has(line.speech)) {
        try {
          const speechFolder = '/speech'
          const gameLocale = 'en'
          const npcId = self?.id
          const audio = new Audio(prependBaseUrl(`${speechFolder}/${gameLocale}/${npcId}/${line.speech}.ogg`))
          await audio.load()
          audioFiles.value.set(line.speech, audio)
        } catch (error) {
          console.error(`Error preloading ${line.speech} audio:`, error)
        }
      }
    }
  }
}

const nextLine = async () => {
  appearTimeout = setTimeout(async () => {
    if (dialogLinesList.value.length > 0) {
      const next = dialogLinesList.value.shift()
      const line = next?.text || ''
      const speech = next?.speech || ''
      isPlayerTalking.value = line.startsWith('> ') || line.startsWith('>')
      currentLine.value = line.startsWith('> ') ? line.substring(2) : line.startsWith('>') ? line.substring(1) : line
      currentSpeech.value = speech
      dialogScale.value = 1 // Scale back up

      if (speech) {
        if (currentAudio) {
          currentAudio.pause()
          currentAudio.currentTime = 0
        }

        currentAudio = audioFiles.value.get(speech) || null

        if (currentAudio) {
          try {
            await currentAudio.play()
          } catch (error) {
            console.error('Error playing audio:', speech, error)
          }
        }
      }

      nextLineTimeout = setTimeout(() => {
        dialogScale.value = 0.5 // Scale down
        nextLine()
      }, DialogDuration.value)
    } else {
      disposeAudioFiles()
      emit('finish')
    }
  }, 300) // Transition time + text set time
}

const onCancelCurrentLine = (event: MouseEvent | KeyboardEvent) => {
  event.preventDefault()
  event.stopPropagation()
  if (currentLine.value && ((event.code as KeyboardEvent) === 'Escape' || (event as MouseEvent)?.button === 2)) {
    clearTimeout(appearTimeout)
    clearTimeout(nextLineTimeout)
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
    }
    currentLine.value = ''
    dialogScale.value = 0.5 // Scale down
    nextLine()
  }
}

const disposeAudioFiles = () => {
  audioFiles.value.forEach(audio => {
    audio.pause()
    audio.src = ''
  })
  audioFiles.value.clear()
}

onMounted(async () => {
  await preloadAudioFiles()

  nextLine()
  window.addEventListener('mousedown', onCancelCurrentLine)
  window.addEventListener('keydown', onCancelCurrentLine)
})

onUnmounted(() => {
  clearTimeout(appearTimeout)
  clearTimeout(nextLineTimeout)
  window.removeEventListener('mousedown', onCancelCurrentLine)
  window.removeEventListener('keydown', onCancelCurrentLine)
  disposeAudioFiles()
})
</script>

<template lang="pug">
  div(class="z-[200] !fixed mx-[10%] w-[80%] left-0 top-[5%]")
    div.glass.card.px-4.py-2.max-h-64.flex.justify-start.word-wrap.break-word.gap-2(
      v-if="dialog.length"
      class="max-w-4/5"
      :style="{ transform: `scale(${dialogScale})`, transition: 'transform 300ms ease-in-out' }"
    )
      span.text-white.text-2xl.font-bold.text-center(:class="{ 'text-yellow-400': isPlayerTalking }" style="text-shadow: 0 0 5px black") {{ t(currentLine) }}
</template>

<style scoped lang="sass"></style>
