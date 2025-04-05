<script setup lang="ts">
import DialogOption from '@/components/atoms/DialogOption.vue'
import SpeechBox from '@/components/organisms/SpeechBox.vue'
import { type ComputedRef, ref, watch, onMounted, onUnmounted } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import $ from '@/global'

interface Option {
  id: string
  order: number
  text: string
  condition: () => boolean
  permanent: boolean
  important: boolean
  onOption: () => void
  onFinished?: () => void
}

interface DialogLine {
  text: string
  speech: string
  type?: string
}

const { t } = useI18n()
const emit = defineEmits(['close'])

const choicesList = ref<Partial<Option>[]>([])
const diaMap = ref<Map<string, boolean>>(new Map())
const dialogOptionsList = ref<Option[]>([
  {
    id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD',
    order: 3,
    text: 'Are you happy with the current state of the world?',
    condition: () => true,
    permanent: true,
    important: false,
    onOption: () => {
      currentDialog.value = [
        {
          text: 'Are you happy with the current state of the world?',
          speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD',
        },
      ]

      choicesList.value = [
        {
          id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES',
          order: 2,
          text: 'Yes, of cause',
          onOption: () => {
            currentDialog.value = [
              {
                text: '> Yeah, actually I love the progress of this project.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_PROGRESS',
              },
              {
                text: 'Oh sure, your right, we are even getting some cool music tracks.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_MUSIC',
              },
              {
                text: "> That's just the icing on the cake.",
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_CAKE',
              },
            ]
          },
        },
        {
          id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO',
          order: 1,
          text: 'No, not really',
          onOption: () => {
            currentDialog.value = [
              {
                text: '> I am not happy with the current state of the world. We are missing some cool worlds to explore and catch more fairies.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_NOT_HAPPY',
              },
              {
                text: 'Well what can we do? We need to await what the 3d level designers are building for us.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_AWAIT_3D',
              },
              {
                text: '> Yeah, your right, chill and code then.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_AGREE_AWAIT',
              },
              {
                text: 'Exactly, calm down man.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_CALM',
              },
            ]
          },
        },
        {
          id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION',
          order: 3,
          text: 'Do I even have any choice?',
          onOption: () => {
            currentDialog.value = [
              {
                text: '> Do I even have any choice? I mean, the fairies are waiting for us, but no world, no exploration, no fun.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION_NO_FUN',
              },
              {
                text: 'Absolutely!',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION_AGREE',
              },
              {
                text: '> Anyways...',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_CHOICE_QUESTION_ANYWAYS',
              },
            ]
          },
        },
      ]
    },
  },
  {
    id: 'DIA_FLF_TRADER_HI',
    order: 1,
    text: 'Hi, who are you?',
    condition: () => true,
    permanent: false,
    important: false,
    onOption: () => {
      currentDialog.value = [
        {
          text: '> Hi, who are you?',
          speech: 'DIA_FLF_TRADER_HI',
        },
        {
          text: 'Do I know you? Be gone, I am busy. Fucking amateur fairy trainer.',
          speech: 'DIA_FLF_TRADER_HI_BE_GONE',
        },
        {
          text: '> Mkay...',
          speech: 'DIA_FLF_TRADER_HI_MKAY',
        },
        {
          text: 'Waaaait.',
          speech: 'DIA_FLF_TRADER_HI_WAIT',
        },
        {
          text: '> What? You said I have to leave',
          speech: 'DIA_FLF_TRADER_HI_YOU_SAID',
        },
        {
          text: 'Loooser. Go get a fairy before you talk to me again.',
          speech: 'DIA_FLF_TRADER_HI_LOOSER',
        },
      ]
    },
  },
  {
    id: 'DIA_FLF_TRADER_FAIRY_DUST',
    order: 6,
    text: 'Do you have some fairy dust for me?',
    condition: () => diaMap.value.get('DIA_FLF_TRADER_HI'),
    permanent: false,
    important: false,
    onOption: () => {
      currentDialog.value = [
        {
          text: '> Do you have some fairy dust for me?',
          speech: 'DIA_FLF_TRADER_FAIRY_DUST',
        },
        {
          text: "Sure man, I'm rich.",
          speech: 'DIA_FLF_TRADER_FAIRY_DUST_SURE',
        },
      ]
    },
    onFinished: () => {
      $.trainer.currency.fairyDust += 5
    },
  },
  {
    id: 'end',
    order: 999,
    text: t('end'),
    condition: () => true,
    permanent: true,
    important: false,
    onOption: () => {
      currentDialog.value = [
        {
          text: `> ${t('end')}`,
          speech: 'DIA_END_GOT_TO_GO',
          type: 'end',
        },
      ]
    },
  },
])

const currentDialog = ref<DialogLine[] | null>(null)
const onOption = (option: Option) => {
  option?.id && diaMap.value.set(option.id, true)

  if (choicesList.value.some(choice => choice.id === option.id)) {
    choicesList.value = []
  }

  option.onOption()
}

const onFinishDialog = () => {
  /* execute on finished Dialog lines callback */
  if (selectedOption.value?.onFinished) {
    selectedOption.value?.onFinished?.()
  }

  if (currentDialog.value?.[0]?.type === 'end') {
    closeDialog()
  }
  if (displayedOptionsList.value.length > 0) {
    selectedOption.value = displayedOptionsList.value[0]
  }
  currentDialog.value = null
}

const displayedOptionsList: ComputedRef<Option[]> = computed(() => {
  const isOptionNotPlayedAndOrPermanent = ({ id, permanent, important }: Option) =>
    (!diaMap.value.get(id) || permanent) && !important

  return choicesList.value.length === 0
    ? dialogOptionsList.value
        .filter(option => isOptionNotPlayedAndOrPermanent(option) && option.condition())
        .sort((a, b) => a.order - b.order)
    : choicesList.value.filter(() => true).sort((a, b) => a.order - b.order)
})

const closeDialog = () => {
  choicesList.value = []
  dialogOptionsList.value = []
  emit('close')
  $.isDialog.value = false
}
$.isDialog.value = true

watch($.isDialog, () => {
  if ($.isDialog.value) {
    // console.log('Dialog opened')
    $.controls.removePointerLock()
  } else {
    // console.log('Dialog closed')
    $.controls.setPointerLock()
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
    DialogOption(v-if="dialogOptionsList.every(option => option.order !== 999)" :text="t('end')" :is-selected="selectedOption?.id === 'end'" @click="closeDialog" @enter="closeDialog" @mouseover="onHover({ id: 'end', order: 999, text: t('end'), condition: () => true, permanent: true, important: false, onOption: closeDialog })")
</template>

<i18n>
en:
  end: 'I gotta go (END)'
de:
  end: 'Ich muss gehen (ENDE)'
</i18n>
