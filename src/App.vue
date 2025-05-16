<template>
  <div
    id="main-app"
    class="flex flex-col h-screen sm:h-full w-screen"
  >
    <main
      class="game relative"
      :class="cssProps"
    >
      <router-view />
      <OptionsModal
        :show="isOptionsModalOpen"
        @close="() => (isOptionsModalOpen = false)"
      />
    </main>
    <img
      src="/images/icons/fairy.png"
      class="absolute cursor z-[999] pointer-events-none"
      alt="cursor"
    />
    <Tutorial />
  </div>
</template>

<script setup lang="ts">
import OptionsModal from '@/components/molecules/OptionsModal.vue'
import Tutorial from '@/components/Tutorial.vue'
import { ENERGY_FEMALE_OLD } from '@/Story/Fairies/energy-fairies.ts'
import { FIRE_DRAGON_OLD } from '@/Story/Fairies/fire-fairies.ts'
import { ICE_SNOWMAN_OLD, ICE_SNOWMAN_YOUNG, ICE_YETI_MIDDLE } from '@/Story/Fairies/ice-fairies.ts'
import { LIGHT_STARLIGHT } from '@/Story/Fairies/light-fairies.ts'
import { METAL_SCORPION_MIDDLE, METAL_SCORPION_OLD, METAL_SCORPION_YOUNG } from '@/Story/Fairies/metal-fairies.ts'
import { NATURE_BUTTERFLY_MIDDLE, NATURE_MUSHROOM_MIDDLE } from '@/Story/Fairies/nature-fairies.ts'
import { NEUTRAL_WARRIOR_MIDDLE } from '@/Story/Fairies/neutral-fairies.ts'
import { PSI_NIGHTMARE } from '@/Story/Fairies/psi-fairies.ts'
import useUser from '@/use/useUser.ts'
import { createFairy } from '@/utils/world.ts'
import { computed, ref } from 'vue'
import $ from '@/global'
import { useRoute } from 'vue-router'

const route = useRoute()
const { isOptionsModalOpen } = useUser()

/* reactivity transform example */
// let count = $ref(0)
// count++
// console.log(count)
const cssProps = computed(() => ({ 'cursor--hidden': !$.showCursor }))
$.isDebug = route.query.debug === 'true' || localStorage.getItem('debug') === 'true'

if ($.isDebug) {
  const activeFairiesList = [
    createFairy(ENERGY_FEMALE_OLD.id, 8),
    createFairy(ICE_SNOWMAN_YOUNG.id, 11),
    createFairy(NATURE_BUTTERFLY_MIDDLE.id, 50),
    createFairy(METAL_SCORPION_OLD.id, 49),
    createFairy(PSI_NIGHTMARE.id, 22),
  ]
  const allFairies = [
    createFairy(LIGHT_STARLIGHT.id, 8),
    { ...createFairy(FIRE_DRAGON_OLD.id, 11), name: 'cute Glurak' },
    createFairy(ICE_SNOWMAN_OLD.id, 11),
    createFairy(ICE_YETI_MIDDLE.id, 15),
    createFairy(NATURE_MUSHROOM_MIDDLE.id, 32),
    createFairy(METAL_SCORPION_YOUNG.id, 12),
    createFairy(METAL_SCORPION_MIDDLE.id, 3),
    { ...createFairy(NEUTRAL_WARRIOR_MIDDLE.id, 22), name: 'nighty' },
  ]
  if (!$.player) {
    $.player = {
      fairiesList: ref(activeFairiesList),
      allFairiesList: ref(allFairies),
    }
  } else {
    $.player.fairiesList = ref(activeFairiesList)
    $.player.allFairiesList = ref(allFairies)
  }
  $.player.fairiesList.value = $.player?.fairiesList.value.map(fairy => {
    // const hp = Math.ceil(Math.random() * 100)
    // const xp = Math.ceil(Math.random() * 1000)
    // const nextLevelXp = xp + Math.ceil(Math.random() * 200)
    return {
      ...fairy,
      // level: 10,
      // xp: xp,
      // nextLevelXp: nextLevelXp,
      stats: {
        ...fairy.stats,
        // hp: hp,
        // hp: 100,
        // maxHp: 100,
        // maxHp: hp + Math.ceil(Math.random() * 20),
        mp: Math.ceil(Math.random() * 100),
      },
    }
  })
}
</script>

<style scoped lang="sass">
#app
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
</style>

<style lang="sass">
*
  cursor: none
body
  margin: 0
  display: flex
  place-items: center
  min-width: 320px
  min-height: 100vh
  overflow: hidden
  cursor: wait
  &.cursor--hidden
    cursor: none

  .cursor
    left: -50px
    top: -50px
    width: 32px
    height: 32px
    position: fixed
    transform: translate(-30%, -25%)
    &.cursor--hidden
      display: none

.rib
  & *, &
    font-family: 'Ribeye', serif
</style>
