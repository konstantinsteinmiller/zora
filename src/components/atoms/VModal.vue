<template>
  <transition name="fade">
    <div v-if="show">
      <div
        class="modal glass card !fixed z-[50] p-3 w-full max-w-lg select-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        :class="{
          [$attrs.class]: true,
        }"
        @keydown.esc="emit('close')"
      >
        <div class="w-full max-w-lg relative mx-auto my-auto">
          <div>
            <div class="flex flex-col text-center flex-auto justify-center items-center leading-6">
              <slot name="title">
                <h2
                  v-if="title"
                  class="text-2xl font-bold py-4"
                >
                  {{ title }}
                </h2>
              </slot>

              <slot name="description">
                <p
                  v-if="description"
                  class="text-md px-8"
                >
                  {{ description }}
                </p>
              </slot>
              <slot name="text"></slot>
            </div>
            <div
              v-if="hasSlot('buttons')"
              class="mt-2 mb-1 text-center space-x-4 md:block"
            >
              <slot name="buttons"></slot>
            </div>
          </div>
        </div>
      </div>
      <div
        class="fixed w-screen bg-black opacity-70 inset-0 z-[1]"
        @click="!isDialog && emit('close')"
      ></div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue'

defineOptions({
  inheritAttrs: false,
})

defineProps({
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: true,
  },
  isDialog: {
    type: Boolean,
    default: false,
  },
})

const slots = useSlots()
const hasSlot = name => !!slots[name]

const emit = defineEmits(['close'])
</script>

<style lang="scss" scoped>
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 500ms ease-out;
}
.no-bg + .fixed.w-screen {
  //background: none;
  border-radius: 12px;
  width: 100%;
  height: 100%;
}
</style>
