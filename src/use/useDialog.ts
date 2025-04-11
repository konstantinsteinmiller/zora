import type { DialogLine, Option } from '@/types/dialog.ts'
import { removeDoubleSlashComments } from '@/utils/function.ts'
import { ref } from 'vue'

let singleton: any

type DialogParams = string[] | Array<{ text: string; speech: string; type: string }>

const useDialog = () => {
  if (singleton) return singleton

  const currentDialog = ref<DialogLine[] | null>(null)
  const choicesList = ref<Partial<Option>[]>([])
  const diaSet = ref<Set<string>>(new Set())
  const diaMap = ref<Map<string, boolean>>(new Map())

  const trackDia = (speech: string) => {
    if (!speech.startsWith('DIA_')) console.warn(`Speech ${speech} does not start with DIA_`)
    if (diaSet.value.has(speech)) {
      console.warn(`Dialog ${speech} already exists, this will lead to overwriting speech files and dialog bugs`)
    } else {
      diaSet.value.add(speech)
    }
  }

  singleton = {
    knows: (dialogId: string) => {
      if (!dialogId.startsWith('DIA_')) console.warn(`Dialog ID ${dialogId} does not start with DIA_`)

      return diaMap.value.get(dialogId)
    },
    setKnown: (dialogId: string) => {
      diaMap.value.set(dialogId, true)
    },
    clearDiaTracking: () => {
      diaSet.value.clear()
    },
    addChoices: (...params: string[]) => {
      if (!choicesList.value?.length) choicesList.value = []

      if (params.every(dia => typeof dia === 'string')) {
        params.forEach((dialogId: string) => {
          if (!dialogId.startsWith('DIA_')) console.warn(`Dialog ID ${dialogId} does not start with DIA_`)

          choicesList.value.push(dialogId)
        })
      }
    },
    addDialog: (...params: DialogParams) => {
      // console.log('params: ', params)
      if (!currentDialog.value?.length) currentDialog.value = []

      if (params.every(dia => typeof dia === 'string' && dia.includes('//'))) {
        params.forEach(dialog => {
          const regex = /^(.*?)\s*\/\/\s*(>?\s*.*)$/
          const match = dialog.match(regex)
          if (match) {
            const speech = match[1].trim()
            const text = match[2].trim()

            trackDia(speech)

            currentDialog.value?.push({ speech, text })
          }
        })
      } else if (params.length === 2 && typeof params[0] === 'string' && !params[0].includes('//')) {
        const [speech, text] = params as string[]

        trackDia(speech)

        currentDialog.value.push({ speech, text })
      } else if (params?.[0] instanceof Object) {
        const { speech, text, type } = params[0]

        trackDia(speech)

        currentDialog.value.push({ speech, text, type })
      }
    },
    choicesList,
    currentDialog,
  }

  window.knows = singleton.knows
  window.addDia = singleton.addDialog
  window.addChoices = singleton.addChoices

  return singleton
}
export default useDialog
