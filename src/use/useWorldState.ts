import { type Ref, ref } from 'vue'
import $ from '@/global'

const playerRef: Ref<any | null> = ref<any | null>(null)
const entitiesListRef: Ref<any | null> = ref<any | null>(null)
const level: Ref<any | null> = ref<any | null>(null)

setTimeout(() => {
  $.world = {
    playerRef,
    entitiesListRef,
    level,
  }
})

export const savePlayer = () => {
  const fairiesList = $.player.fairiesList.value.map((fairy: any) => {
    fairy.evolutionsList = []
    return { ...fairy }
  })
  // console.log('$.player.fairiesList.value: ', $.player.fairiesList.value, $.player.spells.spellsList.value)

  $.world.playerRef.value = JSON.parse(
    JSON.stringify({
      position: $.player.mesh.position,
      currency: $.player.currency,
      inventory: $.player.inventory,
      fairiesList: fairiesList,
      // selectedFairy: $.player.selectedFairy,

      spells: {
        spellsList: $.player.spells.spellsList.value,
      },
    })
  )
  // console.log('$.world.playerRef.value: ', $.world.playerRef.value, $.player.currency.fairyDust)
  // $.world.entitiesListRef.value = $.entitiesMap
  $.world.level.value = $.level
  // $.entitiesMap = new Map()

  // console.log('entitiesListRef.value: ', entitiesListRef.value, $.entitiesMap)
}
