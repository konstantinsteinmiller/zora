import { type Ref, ref } from 'vue'
import $ from '@/global'

export const playerRef: Ref<any | null> = ref<any | null>(null)
export const entitiesListRef: Ref<any | null> = ref<any | null>(null)

export const savePlayer = () => {
  playerRef.value = $.player
}
