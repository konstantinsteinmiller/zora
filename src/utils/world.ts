import FairyController from '@/entity/FairyController.ts'
import $ from '@/global.ts'
import type { Guild } from '@/types/entity.ts'

export async function importNPCs(): Promise<Map<string, any>> {
  const npcMap = new Map<string, any>()
  const npcFiles = import.meta.glob('@/Story/NPCs/*.ts', { eager: true }) // Adjust file extensions if needed

  for (const path in npcFiles) {
    const fileName = path.split('/').pop()?.split('.')[0] // Get filename without extension
    if (fileName) {
      npcMap.set(fileName, npcFiles[path])
    }
  }
  return npcMap
}
let npcs: Map<string, any> = new Map<string, any>()
export const loadNPCs = async () => {
  npcs = await importNPCs()
  // npcs.forEach((npc, name) => {
  // console.log(`NPC: ${name}`, npc)
  // })
}
loadNPCs()

export const spawnNpc = (id: string, wp: string) => {
  const WP = $.level?.WPsMap?.get(wp)
  if (!WP) {
    console.error(`Waypoint ${wp} not found`)
    return
  }

  const npc = npcs.get(id)?.default
  if (!npc) {
    console.error(`NPC ${id} not found`)
    return
  }

  npc({
    id,
    startPosition: WP.position.clone(),
    startRotation: WP.quaternion.clone(),
  })
}

const fairiesMap: Map<string, any> = new Map<string, any>()
export async function importFairies(): Promise<void> {
  const fairyFilesList = import.meta.glob('@/Story/Fairies/*.ts', { eager: true })
  for (const fairyElement in fairyFilesList) {
    const fairiesList = fairyFilesList[fairyElement]
    fairiesList?.default?.forEach((fairy: any) => fairiesMap.set(fairy.id, fairy))
  }
}

export const loadFairies = async () => {
  await importFairies()
  Object.values(fairiesMap).forEach(fairy => {
    console.log(`fairy: ${fairy.stats.name}`, fairy)
  })
}
loadFairies()

export const spawnWildFairy = (id: string, wp: string) => {
  const WP = $.level?.WPsMap?.get(wp)
  if (!WP) {
    console.error(`Waypoint ${wp} not found`)
    return
  }

  // console.log('fairiesMap: ', fairiesMap)
  const fairy = fairiesMap.get(id)
  if (!fairy) {
    console.error(`Fairy ${id} not found`)
    return
  }

  return FairyController({
    ...fairy,
    guild: 'guild-wild-fairy' as Guild,
    startPosition: WP.position.clone(),
  })
}

export const disposeEntity = (entity: any) => {
  $.entitiesMap.set(entity.uuid, undefined)
  entity.mixer = null
  entity.stateMachine = null
  entity.mesh?.traverse((child: any) => {
    child?.geometry?.dispose()
    child?.material?.dispose()
  })
  $.scene.remove(entity.mesh)
  entity.mesh = null
}
