<template>
  <div>
    <select
      :id="listId"
      v-model="model"
      class="w-48 !py-1 !px-3"
      :class="{
        'glass ': true,
        '!cursor-none': IS_ZORA,
      }"
    >
      <option
        v-for="item in items"
        :key="item.id"
        :value="item.value"
      >
        {{ item.label || item.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { IS_ZORA } from '@/utils/constants.ts'
import { v4 as uuidv4 } from 'uuid'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const listId = uuidv4()
const model = defineModel()
</script>

<style lang="scss" scoped>
::selection {
  background: unset;
  color: unset;
}
</style>
