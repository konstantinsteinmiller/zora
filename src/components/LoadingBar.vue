<script setup lang="ts">
import useAssets from '@/use/useAssets.ts'
import { computed } from 'vue'

const { loadingProgress } = useAssets()
const progress = computed(() => loadingProgress.value)
</script>

<template>
  <div>
    <div class="fixed bottom-4 right-1/2 translate-x-1/2">
      <div
        v-if="progress < 99.8"
        class="loading-container"
      >
        <div class="loading-bar glass card">
          <div
            class="loading-progress"
            :style="{ width: `${progress}%` }"
          />
        </div>
        <div class="loading-text">
          Loading assets...
          <span
            class="text-white"
            style="text-shadow: #299867 0 0 4px"
            >{{ Math.round(progress) }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="sass">
.loading-container
  display: flex
  flex-direction: column
  align-items: center
  width: 300px

.loading-bar
  width: 100%
  height: 20px
  background-color: #444
  border-radius: 10px
  overflow: hidden
  margin-bottom: 8px

.loading-progress
  height: 100%
  backdrop-filter: blur(10px)
  background: linear-gradient(to right, var(--vue-gradient-1), var(--vue-gradient-2), var(--vue-gradient-3))
  transition: width 0.3s ease


.loading-text
  background: linear-gradient(to right, var(--vue-gradient-1), var(--vue-gradient-2), var(--vue-gradient-3))
  background-clip: text
  color: transparent
  font-size: 1.5rem
  font-family: 'AmaticSC', serif
</style>
