<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps({
  header: {
    type: String,
    required: false,
  },
})
const emit = defineEmits(['done'])
const { t } = useI18n()

setTimeout(() => {
  emit('done')
}, 13000)
</script>

<template lang="pug">
  h2.glass.flex.justify-center(v-if="header") {{ header }}
  .flex.flex-col.grid.grid-cols-3.items-center.justify-center.gap-2(class="text-[15px]")
    .max-w-80.col-span-3 {{ t('overcharged') }}
</template>

<i18n>
en:
  overcharged: "You have charged to long and lost control of the spell. It damaged yourself."
de:
  overcharged: "Du hast den Zauber zu lange aufgeladen und die Kontrolle verloren. Es hat dich selbst verletzt."
</i18n>
