import type { BoolEnum } from '@/types/general.ts'
import { type Ref, ref } from 'vue'

const activatedKeysMap: Ref<BoolEnum> = ref({})
const clearKeysMap = () => {
  activatedKeysMap.value = {}
}
export const useKeyboard = () => {
  return {
    activatedKeysMap,
    clearKeysMap,
  }
}
