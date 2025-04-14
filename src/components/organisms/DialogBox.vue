<script setup lang="ts">
import DialogOption from '@/components/atoms/DialogOption.vue'
import SpeechBox from '@/components/organisms/SpeechBox.vue'
import type { Option } from '@/types/dialog.ts'
import useDialog from '@/use/useDialog.ts'
import useInteraction from '@/use/useInteraction.ts'
import useUser from '@/use/useUser.ts'
import { type ComputedRef, ref, watch, onMounted, onUnmounted } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import $ from '@/global'

const { t } = useI18n()
const emit = defineEmits(['close'])

const { currentDialog, choicesList, knows, setKnown, clearDiaTracking } = useDialog()

const dialogOptionsList = ref<Option[]>([]) // Initialize as empty array
const executedOption = ref<Option | null>(null)

watch(
  () => $.dialogSelf.value,
  async newValue => {
    if (!newValue) return
    try {
      if ($.dialogSelf.value?.id) {
        const dialogModule = await import(`@/Story/dialogs/DIA_${$.dialogSelf.value.id.toUpperCase()}.ts`)
        /* fill in an end option if writers forget to add one */
        if (dialogModule.default.every((option: Option) => option.order !== 999)) {
          dialogModule.default.push({
            id: 'DIA_END',
            order: 999,
            text: t('end'),
            condition: () => true,
            permanent: true,
            important: false,
            on: () => addDia({ text: `> I got to go`, speech: 'DIA_END_GOT_TO_GO', type: 'end' }),
          })
        }

        dialogOptionsList.value = dialogModule.default
        $.importantDialog.value = dialogOptionsList.value.filter(
          option => option.important && option?.condition?.() && !knows(option.id)
        )
      }
    } catch (error) {
      console.error('Failed to load dialogs:', error)
      dialogOptionsList.value = []
    }
  },
  { immediate: true }
)

const onOption = (option: Option) => {
  option?.id && setKnown(option.id)

  executedOption.value = option

  choicesList.value = []

  if (!option.on) console.error('Please add on function to ', option?.id)
  option.on()
}

const selectFirstOption = () => {
  if (displayedOptionsList.value.length > 0) {
    selectedOption.value = displayedOptionsList.value[0]
  }
}

const onFinishDialog = () => {
  /* execute on finished Dialog lines callback */
  if (selectedOption.value?.onFinished && executedOption.value === selectedOption.value) {
    selectedOption.value?.onFinished?.()
  }

  if (currentDialog.value?.[0]?.type === 'end' || currentDialog.value?.[0].speech.startsWith('DIA_END')) {
    closeDialog()
  }
  selectFirstOption()
  currentDialog.value = null
}

const displayedOptionsList: ComputedRef<Option[]> = computed(() => {
  const isOptionNotPlayedAndOrPermanent = ({ id, permanent, important }: Option) =>
    (!knows(id) || permanent) && !important

  return choicesList.value.length === 0
    ? dialogOptionsList.value
        .filter(
          option =>
            isOptionNotPlayedAndOrPermanent(option) && typeof option.condition === 'function' && option.condition()
        )
        .sort((a, b) => a.order - b.order)
    : choicesList.value.every((c: any) => typeof c === 'string')
      ? dialogOptionsList.value.filter(dia => choicesList.value.includes(dia.id)).sort((a, b) => a.order - b.order)
      : choicesList.value.filter(() => true).sort((a: any, b: any) => a.order - b.order)
})

const { interactionId } = useInteraction()
const closeDialog = () => {
  choicesList.value = []
  dialogOptionsList.value = []
  clearDiaTracking()
  emit('close')

  /* reset background music to normal volume */
  $.sounds.bgMusic.value?.setVolume?.(originalVolume)
  $.importantDialog.value = []
  $.isDialog.value = false

  // console.log('Dialog closed')
  interactionId.value = ''
}

const { userMusicVolume } = useUser()
const onOpenDialog = () => {
  originalVolume = userMusicVolume.value * 0.25
  let reducedDialogVolume = originalVolume * 0.05
  reducedDialogVolume = originalVolume > 0.08 ? reducedDialogVolume : 0.01
  $.sounds.bgMusic.value.setVolume(reducedDialogVolume)

  // console.log('Dialog opened')
  selectFirstOption()
}

let originalVolume: any
watch($.isDialog, () => {
  if ($.isDialog.value) {
    onOpenDialog()
  } else {
    closeDialog()
  }
})

const showDialogBox = computed(() => {
  return isWorldInitialized.value && $.isDialog.value && (!currentDialog.value || currentDialog.value.length === 0)
})

const isWorldInitialized = ref(false)
const selectedOption = ref<Option | null>(null)
const lastScrollTime = ref(0)

const onKey = (event: KeyboardEvent) => {
  if (!showDialogBox.value || !$.isDialog.value) return

  const options = displayedOptionsList.value
  if (options.length === 0) return

  if (['KeyW', 'ArrowUp'].includes(event.code)) {
    event.preventDefault()
    const currentIndex = selectedOption.value ? options.findIndex(option => option.id === selectedOption.value?.id) : -1
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
    selectedOption.value = options[nextIndex]
  } else if (['KeyS', 'ArrowDown'].includes(event.code)) {
    event.preventDefault()
    const currentIndex = selectedOption.value ? options.findIndex(option => option.id === selectedOption.value?.id) : -1
    const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
    selectedOption.value = options[nextIndex]
  } else if (['Enter', 'KeyE'].includes(event.code)) {
    event.preventDefault()
    onOption(selectedOption.value)
  } else if (['Escape'].includes(event.code)) {
    event.preventDefault()
    const endOption = displayedOptionsList.value.find(option => option.id === 'DIA_END' || option.order === 999)?.on()
    endOption && onOption(endOption)
  }
}

const onHover = (option: Option) => {
  if (!showDialogBox.value || !$.isDialog.value) return
  selectedOption.value = option
}

const onMouseClick = (event: MouseEvent) => {
  if (!showDialogBox.value || !$.isDialog.value) return
  // Left mouse button
  if (event.button === 0 && selectedOption.value) {
    onOption(selectedOption.value)
  }
}

const onWheel = (event: WheelEvent) => {
  if (!showDialogBox.value || !$.isDialog.value) return

  const currentTime = Date.now()
  if (currentTime - lastScrollTime.value < 150) {
    // Limit scroll speed
    event.preventDefault()
    return
  }
  lastScrollTime.value = currentTime

  const options = displayedOptionsList.value
  if (options.length === 0) return

  const currentIndex = selectedOption.value ? options.findIndex(option => option.id === selectedOption.value?.id) : -1
  let nextIndex = currentIndex

  if (event.deltaY < 0) {
    // Scroll up
    nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
  } else {
    // Scroll down
    nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
  }

  selectedOption.value = options[nextIndex]
  event.preventDefault()
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('mousedown', onMouseClick)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('mousedown', onMouseClick)
})

const initUuid = $.addEvent('renderer.update', () => {
  if ($.isWorldInitialized) {
    isWorldInitialized.value = true
    $.removeEvent('renderer.update', initUuid)
  }
})
</script>

<template lang="pug">
  SpeechBox(v-if="currentDialog" :dialog="currentDialog" @finish="onFinishDialog")
  div.glass.card.left-0.px-4.py-2.max-h-64.flex.flex-col.justify-center.items-left(v-if="showDialogBox" class="z-[200] !fixed mx-[1%] w-[98%] bottom-3")
    DialogOption(v-for="option in displayedOptionsList" :key="option.order" :text="option.text" :is-selected="selectedOption?.id === option.id" @click="onOption(option)" @enter="onOption(option)" @mouseover="onHover(option)")
</template>

<i18n>
en:
  end: 'I gotta go (END)'
de:
  end: 'Ich muss gehen (ENDE)'
</i18n>
