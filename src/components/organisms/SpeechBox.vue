<script setup lang="ts">
import { BASE_DIALOG_DURATION, dialogTextSpeed } from '@/utils/constants.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { computed, type ComputedRef, ref, onMounted, onUnmounted, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import $ from '@/global'

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

const self: any = $.dialogSelf.value

const { t } = useI18n()
const emit = defineEmits(['finish'])
const dialogLinesList = ref<SpeechOption[]>(JSON.parse(JSON.stringify(props.dialog)))
const currentLine = ref('')
const currentSpeech = ref('')
const dialogScale = ref(0.5) // Initial scale
const audioFiles = ref<Map<string, HTMLAudioElement>>(new Map()) // Map to store audio files
const displayedText = ref('')
const textIndex = ref(0)
const textInterval = ref<number | null>(null)

const DialogDuration: ComputedRef<number> = computed(() => {
  const audio = audioFiles.value.get(currentSpeech.value)
  if (audio) {
    return audio.duration * 1000 // Audio duration in milliseconds
  }
  return BASE_DIALOG_DURATION + currentLine.value.length * dialogTextSpeed.value
})

const isPlayerTalking: Ref<boolean> = ref(false)

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
          let audio = null
          if (line.speech === 'DIA_END_GOT_TO_GO' || line.speech === 'DIA_END') {
            audio = new Audio(prependBaseUrl(`${speechFolder}/${gameLocale}/${line.speech}.ogg`))
          } else {
            audio = new Audio(prependBaseUrl(`${speechFolder}/${gameLocale}/${npcId}/${line.speech}.ogg`))
          }
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
      displayedText.value = ''
      textIndex.value = 0

      if (textInterval.value) {
        clearInterval(textInterval.value)
        textInterval.value = null
      }

      if (currentLine.value.length > 0) {
        const firstWord = currentLine.value.split(' ')[0]
        displayedText.value = `${firstWord} `
        textIndex.value = firstWord.length + 1
      }

      textInterval.value = setInterval(() => {
        if (textIndex.value < currentLine.value.length) {
          displayedText.value += currentLine.value[textIndex.value]
          textIndex.value++
        } else {
          clearInterval(textInterval.value)
          textInterval.value = null
        }
      }, dialogTextSpeed.value - 25)

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
  if (textInterval.value) {
    clearInterval(textInterval.value)
  }
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
      span.text-white.text-2xl.font-bold.text-center(:class="{ 'text-yellow-400': isPlayerTalking }" style="text-shadow: 0 0 5px black") {{ t(displayedText) }}
</template>

<style scoped lang="sass"></style>
