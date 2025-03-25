<script setup lang="ts">
import { useKeyboard } from '@/use/useKeyboard.ts'
import { computed, type ComputedRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Key from '@/components/atoms/KeyboardKey.vue'

defineProps({
  header: {
    type: String,
    required: false,
  },
})
const emit = defineEmits(['done'])
const { t } = useI18n()
const { clearKeysMap } = useKeyboard()
clearKeysMap()

const { activatedKeysMap } = useKeyboard()

const controlKeysList = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Mouse0', 'Mouse2']

const allPressed: ComputedRef<boolean> = computed(() =>
  controlKeysList.every((key: string) => activatedKeysMap.value[key])
)
let isDone = false

watch(
  activatedKeysMap,
  () => {
    if (!isDone && allPressed.value) {
      setTimeout(() => {
        emit('done')
      }, 500)
      isDone = true
    }
  },
  { deep: true }
)
</script>

<template lang="pug">
  h2.glass.flex.justify-center(v-if="header") {{ header }}
  .flex.flex-col.grid.grid-cols-3.items-center.justify-center.gap-2(class="text-[15px]")
    .max-w-80.col-span-2 {{ t('useControlKeys') }}
    //img(:src="AKeyImg" alt="A key" class="w-6 h-6")
    .flex.justify-center.items-center
      .grid.grid-cols-3.grid-rows-2.w-28.mt-2.items-center.justify-center
        .some
        .key.mb-1
          Key(k="KeyW")
        .some
        .lower-row-key
          Key(k="KeyA")
        .lower-row-key
          Key(k="KeyS")
        .lower-row-key
          Key(k="KeyD")
    .max-w-80.text-wrap.col-span-2 {{ t('useMouseLeft') }}
    .flex.justify-center.items-center
      Key(k="Mouse0")
    .max-w-80.col-span-2 {{ t('useMouseRight') }}
    .flex.justify-center.items-center
      Key(k="Mouse2")
</template>

<i18n>
en:
  useControlKeys: "Move your character:"
  useMouseLeft: "HOLD Left mouse button to charge. Release when strong enough."
  useMouseRight: "Right mouse button to fly."
de:
  useControlKeys: "Bewege deinen Charakter:"
  useMouseLeft: "HALTE die linke Maustaste um aufzuladen. Loslassen wenn stark genug."
  useMouseRight: "Rechte Maustaste um zu fliegen."
</i18n>
