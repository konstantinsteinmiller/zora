import type { DialogLine, Option } from '@/types/dialog.ts'
import { ref } from 'vue'

let singleton: any
const useDialog = () => {
  if (singleton) return singleton

  const currentDialog = ref<DialogLine[] | null>(null)
  const choicesList = ref<Partial<Option>[]>([])
  const diaMap = ref<Map<string, boolean>>(new Map())
  singleton = {
    knows: (dialogId: string) => {
      if (!dialogId.startsWith('DIA_')) console.warn(`Dialog ID ${dialogId} does not start with DIA_`)

      return diaMap.value.get(dialogId)
    },
    setKnown: (dialogId: string) => {
      diaMap.value.set(dialogId, true)
    },
    choicesList,
    currentDialog,
  }

  return singleton
}
export default useDialog
