<script setup lang="ts">
import useMessage, { type Message } from '@/use/useMessage'
import { onMounted, onUnmounted } from 'vue'

const { messagesList, removeMessage } = useMessage()

onMounted(() => {
  const updateProgress = () => {
    messagesList.value.forEach((message: Message) => {
      if (message.lifespan && !message.paused) {
        const elapsed = Date.now() - message.timestamp
        message.progress = Math.max(0, 100 - (elapsed / message.lifespan) * 100)
        if (elapsed >= message.lifespan) {
          removeMessage(message.id)
        }
      }
    })
  }

  const interval = setInterval(updateProgress, 16)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <div class="fixed top-1/3 left-2 z-50 space-y-2 flex flex-col gap-1">
    <div
      v-for="message in messagesList"
      :key="message.id"
      class="toast glass card shadow-md max-w-72 transition duration-300 ease-out relative"
    >
      <p
        class="text-sm px-3 py-2 text-white text-[1.25rem]"
        style="text-shadow: 0 0 3px black"
      >
        {{ message.message }}
      </p>
    </div>
  </div>
</template>
