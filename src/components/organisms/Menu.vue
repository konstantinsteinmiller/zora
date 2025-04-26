<script setup lang="ts">
import FairyCollection from '@/components/organisms/FairyCollection.vue'
import FairySelection from '@/components/organisms/FairySelection.vue'
import SpellSelection from '@/components/organisms/SpellSelection.vue'
import { MENU, type MenuItem } from '@/utils/enums.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { type Ref, ref } from 'vue'
import $ from '@/global'

const debugMenuItem = localStorage.getItem('autoMenu')
if (debugMenuItem) {
  $.menuItem.value = debugMenuItem
}

interface MenuItemEntry {
  name: string
  id: MenuItem
  icon: string
}

const menuItemsList: Ref<MenuItemEntry[]> = ref([
  { name: 'World Map', id: MENU.MAP, icon: '/images/icons/map_128x128.png' },
  { name: 'Fairy Collection', id: MENU.COLLECTION, icon: '/images/icons/book_128x128.png' },
  { name: 'Menu Items', id: MENU.ITEMS, icon: '/images/icons/potion_128x128.png' },
  { name: 'Menu Fairy', id: MENU.FAIRY, icon: '/images/icons/fairy.png' },
  { name: 'Menu Attack Spells', id: MENU.ATTACK_SPELLS, icon: '/images/icons/scroll_128x128.png' },
  { name: 'Menu passive Spells', id: MENU.PASSIVE_SPELLS, icon: '/images/icons/scroll_128x128.png' },
])
menuItemsList.value = menuItemsList.value.map(item => {
  item.icon = prependBaseUrl(item.icon)
  return item
})

const onMenuClick = (menuItem: MenuItemEntry) => ($.menuItem.value = menuItem.id)
</script>

<template lang="pug">
  div.menu-container.top-0.left-0.card.glass.dark.relative.z-100(
    v-if="$.menuItem.value && !$.menuItem.value.startsWith('util-')"
    class="!fixed z-[10] w-[99.5vw] h-[99.5vh] translate-x-[0.25vw] translate-y-[0.25vh] !rounded-[6px] !border-x-0"
  )
    div.collection.container.w-full.h-full.flex.flex-col.items-start.justify-start.absolute.top-0(
      class="left-1/2 -translate-x-1/2"
    )
      img.absolute.left-0(src="/images/logo/Zora_logo_300x246.png" alt="logo"
        class="w-[100px] top-[2px]"
      )
      div.h-16.flex.self-center.relative.items-center.gap-1(class="mt-[2px]")
        img.object-fit(src="/images/frames/fancy-frame-wide_1024x256.png" alt="navigation item"
          class="z-10 absolute top-0 -left-[1px] !w-[352px] h-[60px]")
        div.gap-1.flex.items-center.justify-center(class="py-[6px] px-2")
          div.spotlight.w-12.h-12.relative.flex.items-center.gap-2(
            v-for="(menuItem, itemIndex) in menuItemsList" :key="`menu-item-${itemIndex}`"
            class="z-20"
            :style="`${menuItem.id !== $.menuItem.value ? 'filter: grayscale(100%)': ''}`"
            @click="onMenuClick(menuItem)"
          )
            img.icon.absolute.top-0.left-0.w-8.h-8.mt-2.ml-2(:src="menuItem.icon" :alt="`${menuItem.name} icon`" class="")
            img.frame.absolute.bottom-0.right-0(src="/images/frames/frame-simple_128x128.png" :alt="`frame`" class="")
      div.justify-self-end.absolute.top-0.right-0.flex.justify-center.items-center
        //div.w-12.h-12.text-4xl.text-center.text-red-700.z-20(@click="$.menuItem.value = null") x
        img.w-8.h-8(
          src="/images/icons/x_128x128.png" alt="close icon"
          class="scale-[65%] z-20"
          @click="$.menuItem.value = null"
        )
        img.frame.absolute.bottom-0.right-0(src="/images/frames/frame-simple_128x128.png" :alt="`frame`" class="")
      div.menu-content.relative.h-full.w-full.flex-grow-1
        FairyCollection
        FairySelection
        SpellSelection
        //div.menu-items  Menu Items
        //div.menu-spells Menu Spells
</template>

<style scoped lang="sass">
.spotlight
  background: radial-gradient(80px circle at 10px 10px, rgba(95, 21, 198, 0.59) 30%,  transparent 55%) !important
.collection
  background: radial-gradient(800px circle at 45vw 55vh, rgba(95, 21, 198, 0.07) 30%,  transparent 55%) !important
</style>
