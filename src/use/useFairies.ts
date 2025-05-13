import $ from '@/global.ts'
import { LIGHT_STARLIGHT } from '@/Story/Fairies/light-fairies.ts'
import { NATURE_BUTTERFLY_MIDDLE } from '@/Story/Fairies/nature-fairies.ts'
import type { Fairy } from '@/types/fairy.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { computed, ref, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const fairiesList: Ref<Fairy[]> = ref([])

export default () => {
  const loadFairies = async () => {
    const fairyModules = import.meta.glob('@/Story/Fairies/*.ts', { eager: true })
    fairiesList.value = Object.values(fairyModules).reduce((acc, elementalFairiesList) => {
      // const elementalFairiesList = module.default
      acc = [
        ...acc,
        ...elementalFairiesList.default.map((fairy: Fairy) => {
          const modelPath = fairy.modelPath.split('/')
          modelPath.pop()
          const imagePath = modelPath.join('/')
          return {
            ...fairy,
            avatar: prependBaseUrl(`${imagePath}/avatar_128x128.jpg`),
            preview: prependBaseUrl(`${imagePath}/preview_400x463.jpg`),
          }
        }),
      ]
      return acc
    }, [])
    // console.log('fairies: ', fairiesList.value)
  }
  !fairiesList.value?.length && loadFairies()

  const fairiesIdsList = computed(() => {
    return fairiesList.value.map((f: Fairy) => f.id)
  })

  window.fairyIds = fairiesIdsList.value
  const getFairyClassFromQueryParams = () => {
    console.log('$.route.value: ', $.route.value)
    const { player, enemy } = $.route.value?.query

    let playerFairyClass: Fairy | undefined
    let enemyFairyClass: Fairy | undefined
    if (typeof player === 'string' && player.length > 5) {
      playerFairyClass = fairiesList.value.find(fairy => fairy?.id === player)
      if (!playerFairyClass) {
        console.warn(`Unable to find player fairyId: '${player}'`)
      }
    } else if (localStorage.getItem('playerFairyClass')?.length) {
      const fairyId = localStorage.getItem('playerFairyClass')
      playerFairyClass = fairiesList.value.find(fairy => fairy?.id === fairyId) || undefined
    } else {
      playerFairyClass = LIGHT_STARLIGHT
    }

    if (typeof enemy === 'string' && enemy.length > 5) {
      enemyFairyClass = fairiesList.value.find(fairy => fairy?.id === enemy)
      if (!enemyFairyClass) {
        console.warn(`Unable to find enemy fairyId: '${enemy}'`)
      }
    } else if (localStorage.getItem('enemyFairyClass')?.length) {
      const fairyId = localStorage.getItem('enemyFairyClass')
      enemyFairyClass = fairiesList.value.find(fairy => fairy?.id === fairyId) || undefined
    } else {
      enemyFairyClass = NATURE_BUTTERFLY_MIDDLE
    }

    return [playerFairyClass, enemyFairyClass]
  }

  return {
    fairiesList,
    fairiesIdsList,
    getFairyClassFromQueryParams,
  }
}
