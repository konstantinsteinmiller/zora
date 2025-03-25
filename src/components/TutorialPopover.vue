<script setup lang="ts">
import XButton from '@/components/atoms/XButton.vue'
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  left: {
    type: String,
    required: false,
  },
  right: {
    type: String,
    required: false,
  },
  top: {
    type: String,
    required: false,
  },
  bottom: {
    type: String,
    required: false,
  },
})
const emit = defineEmits(['close'])

const { t } = useI18n()

const popoverStyles: ComputedRef<any> = computed(() => ({
  ...{ left: props.left ? `${+props.left * 0.25}rem` : undefined },
  ...{ right: props.right ? `${+props.right * 0.25}rem` : undefined },
  ...{ bottom: props.bottom ? `${+props.bottom * 0.25}rem` : undefined },
  ...{ top: props.top ? `${+props.top * 0.25}rem` : undefined },
}))
</script>

<template lang="pug">
  .tutorial-popover(
    :class="['fixed z-[199]']",
    :style="popoverStyles"
  )
    .glass.card.p-4.max-w-96.max-h-80
      slot You forgot to add the SLOT CONTENT here!

      //.actions.flex.justify-end.mt-1
        //slot(name="buttons")
        //  XButton(
        //    class="mt-2 with-bg"
        //    @click="() => (emit('close'))"
        //  ) {{ t('understood') }}
</template>
