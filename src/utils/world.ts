import fairiesList from '@/components/organisms/FairiesList.vue'
import FairyController from '@/entity/FairyController.ts'
import $ from '@/global.ts'
import { ENERGY_FEMALE_OLD } from '@/Story/Fairies/energy-fairies.ts'
import { FIRE_DRAGON_OLD } from '@/Story/Fairies/fire-fairies.ts'
import { ICE_SNOWMAN_OLD, ICE_SNOWMAN_YOUNG, ICE_YETI_MIDDLE } from '@/Story/Fairies/ice-fairies.ts'
import { LIGHT_STARLIGHT } from '@/Story/Fairies/light-fairies.ts'
import { METAL_SCORPION_MIDDLE, METAL_SCORPION_OLD, METAL_SCORPION_YOUNG } from '@/Story/Fairies/metal-fairies.ts'
import { NATURE_BUTTERFLY_MIDDLE, NATURE_MUSHROOM_MIDDLE } from '@/Story/Fairies/nature-fairies.ts'
import { NEUTRAL_WARRIOR_MIDDLE } from '@/Story/Fairies/neutral-fairies.ts'
import { PSI_NIGHTMARE } from '@/Story/Fairies/psi-fairies.ts'
import type { Guild } from '@/types/entity.ts'
import type { Fairy } from '@/types/fairy.ts'
import type { Spell } from '@/types/spells.ts'
import { levelUpFairy } from '@/utils/fairy.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { v4 } from 'uuid'
import { ref } from 'vue'

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

interface NpcProps {
  id: string
  wp: string
  fairiesList: Fairy[]
}
export const spawnNpc = ({ id, wp, fairiesList }: NpcProps) => {
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
    fairiesList,
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

const spellsMap: Map<string, any> = new Map<string, any>()
let spellsList: Spell[] = []
export async function importSpells(): Promise<void> {
  const spellFilesList = import.meta.glob('@/Story/Spells/*.ts', { eager: true })
  for (const spellElement in spellFilesList) {
    const allSpellsList: Spell[] = Object.values(spellFilesList[spellElement])
    // console.log('allSpellsList: ', allSpellsList)
    spellsList = spellsList.concat(allSpellsList)
    allSpellsList?.forEach((spell: any) => spellsMap.set(spell.name, spell))
  }
}

export const loadSpells = async () => {
  await importSpells()
}
loadSpells()

// export const allSpellsMap = ref(spellsMap)
export const allSpellsList = ref(spellsList)

export const createFairy = (id: string, level: number, guild: Guild = 'guild-companion-fairy' as Guild): Fairy => {
  const templateFairy = fairiesMap.get(id)
  // console.log('templateFairy: ', templateFairy)

  const modelPath = templateFairy.modelPath.split('/')
  modelPath.pop()
  const imagePath = modelPath.join('/')

  const fairyInstance = {
    ...templateFairy,
    uuid: v4(),
    guild,
    stats: {
      ...templateFairy.stats,
      mp: 100,
      previousMp: 100,
      maxMp: 100,
      hp: 100,
      previousHp: 100,
      maxHp: 100,
      power: 10,
      defense: 0,
      speed: 0,
      special: 0,
    },
    avatar: prependBaseUrl(`${imagePath}/avatar_128x128.jpg`),
    preview: prependBaseUrl(`${imagePath}/preview_400x463.jpg`),
  }
  levelUpFairy(fairyInstance, level)
  // console.log('leveled fairyInstance: ', fairyInstance)
  return fairyInstance
}

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

  // const leveledFairy = levelFairy(fairy, 20)
  return FairyController({
    ...fairy,
    // level: 10,
    // xp: 0,
    // nextLevelXp: 10,
    // getLeveledStats
    stats: { name: fairy.name },
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

export const addMockedFairies = () => {
  const activeFairiesList = [
    createFairy(ENERGY_FEMALE_OLD.id, 8),
    createFairy(ICE_SNOWMAN_YOUNG.id, 11),
    createFairy(NATURE_BUTTERFLY_MIDDLE.id, 50),
    createFairy(METAL_SCORPION_OLD.id, 49),
    createFairy(PSI_NIGHTMARE.id, 22),
  ]
  const allFairies = [
    createFairy(LIGHT_STARLIGHT.id, 8),
    { ...createFairy(FIRE_DRAGON_OLD.id, 11) },
    createFairy(ICE_SNOWMAN_OLD.id, 11),
    createFairy(ICE_YETI_MIDDLE.id, 15),
    createFairy(NATURE_MUSHROOM_MIDDLE.id, 32),
    createFairy(METAL_SCORPION_YOUNG.id, 12),
    createFairy(METAL_SCORPION_MIDDLE.id, 3),
    { ...createFairy(NEUTRAL_WARRIOR_MIDDLE.id, 22) },
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
}
