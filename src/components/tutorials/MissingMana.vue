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
    .max-w-80.col-span-3 {{ t('missingMana') }}
</template>

<i18n>
en:
  missingMana: "You are low on mana. If the charged attack costs more mana than you have, you will loose health points for every point of mana you are missing."
de:
  missingMana: "Du hast zu wenig Mana. Wenn der aufgeladene Angriff mehr Mana kostet, als du hast, verlierst du für jeden Punkt Mana, den du vermisst, Leben."
</i18n>
