import $ from '@/global.ts'

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
