import $ from '@/global.ts'
import { Mesh } from 'three'

interface Entity {
  uuid: string
  id: string
  mesh: Mesh
}

const useOctree = (): {
  getNearbyEntities: (targetEntity: Entity, radius: number) => Entity[]
  getClosestEntity: (targetEntity: Entity, radius: number, guildFilter: string[]) => Entity | null
  getClosestFairySpawn: (targetEntity: Entity, radius: number) => string | null
} => {
  const getNearbyEntities = (targetEntity: Entity, radius: number): Entity[] => {
    const nearby: Entity[] = []

    const entityIterator = $.entitiesMap[Symbol.iterator]()
    for (const item of entityIterator) {
      const entity = item[1]

      if (entity?.uuid !== targetEntity.uuid) {
        const entityPosition = entity.mesh.position
        const distanceSq = targetEntity.mesh.position.distanceToSquared(entityPosition)
        if (distanceSq <= radius * radius) {
          nearby.push(entity)
        }
      }
    }

    return nearby
  }

  const getClosestEntity = (targetEntity: Entity, radius: number, guildFilter: string[]): Entity | null => {
    let closestEntity: Entity | null = null
    let closestDistanceSq = Infinity

    const entityIterator = $.entitiesMap[Symbol.iterator]()
    for (const item of entityIterator) {
      const entity = item[1]

      if (
        entity?.mesh &&
        entity?.uuid !== targetEntity.uuid &&
        !guildFilter.some(guild => entity.guild?.includes(guild))
      ) {
        const entityPosition = entity.mesh.position
        const distanceSq = targetEntity.mesh.position.distanceToSquared(entityPosition)

        if (distanceSq <= radius * radius && distanceSq < closestDistanceSq) {
          closestDistanceSq = distanceSq
          closestEntity = entity
        }
      }
    }

    return closestEntity
  }

  const getClosestFairySpawn = (targetEntity: Entity, radius: number): string | null => {
    let closestFP: string | null = null
    let closestDistanceSq = Infinity

    const wpIterator = $.level?.WPsMap[Symbol.iterator]()
    for (const item of wpIterator) {
      const WP = item[1]

      if (WP?.name.startsWith('FP_SPAWN_')) {
        const distanceSq = targetEntity.mesh.position.distanceToSquared(WP.position)

        if (distanceSq <= radius * radius && distanceSq < closestDistanceSq) {
          closestDistanceSq = distanceSq
          closestFP = WP.name
        }
      }
    }

    return closestFP
  }

  return {
    getNearbyEntities,
    getClosestEntity,
    getClosestFairySpawn,
  }
}
export default useOctree
