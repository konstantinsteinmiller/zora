<template>
  <label class="glass switch inline-flex items-center cursor-pointer">
    <input
      v-model="model"
      type="checkbox"
      class="sr-only peer"
      :class="{
        '!cursor-none': IS_ZORA,
      }"
      @change="() => emit('change', model)"
    />
    <div
      :class="`relative w-9 h-5
      peer-focus:outline-none peer-focus:ring-3
      dark:peer-focus:ring-blue-800 rounded-full peer
      dark:bg-gray-700 peer-checked:after:translate-x-full
      rtl:peer-checked:after:-translate-x-full
      peer-checked:after:border-white after:content-['']
      after:absolute after:top-[2px] after:start-[2px]
      after:bg-white after:border-gray-300 after:border
      after:rounded-full after:h-4 after:w-4 after:transition-all
      dark:border-gray-600`"
    />
    <!-- peer-checked:bg-blue-800 bg-gray-200 peer-focus:ring-blue-300-->
    <span
      v-if="title"
      class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
      >{{ title }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { IS_ZORA } from '@/utils/constants.ts'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const model = defineModel()
const emit = defineEmits(['change'])
</script>

<style scoped lang="scss">
//.glass {
//}
</style>
