import ArenaController from '@/entity/ArenaController.ts'
import { createEnemyMovementStrategy } from '@/entity/MovementStrategy.ts'
import $ from '@/global'
import type { Guild } from '@/types/entity.ts'
import { aiChargeUtils, chargeUtils, controllerAwarenessUtils, createOverHeadHealthBar } from '@/utils/controller.ts'
import { moveToTargetPosition } from '@/utils/navigation.ts'
import { type Quaternion, Vector3 } from 'three'

const AIController = (config: {
  modelPath: string
  startPosition: Vector3
  startRotation: Quaternion
  modelHeight: number
  stats?: any
  guild: Guild
}) => {
  const entity = ArenaController(config)

  const utils: any = { ...controllerAwarenessUtils(), ...chargeUtils(), ...aiChargeUtils() }
  for (const key in utils) {
    entity[key] = utils[key]
  }

  const movementStrategy = createEnemyMovementStrategy()

  createOverHeadHealthBar(entity)

  entity.isAwaitingCoverCalculation = false
  entity.lastCoverPosition = null

  let enemy: any = null
  const performAgentLogic = () => {
    if (!enemy || enemy?.isDead()) {
      const entityIterator = $.entitiesMap[Symbol.iterator]()

      const candidatesList = []
      for (const item of entityIterator) {
        const value = item[1]

        if (value?.guild === 'guild-0') {
          candidatesList.push(value)
        }
      }

      if (candidatesList.length > 0) {
        enemy = candidatesList.reduce((closestEnemy, curr) => {
          return entity.position.distanceTo(curr.position) < entity.position.distanceTo(closestEnemy.position) &&
            !enemy?.isDead()
            ? curr
            : closestEnemy
        }, candidatesList[0])
      }

      if (!enemy) return
    }

    // AI Logic: Threat Detection and Pathfinding
    if ($?.level?.pathfinder) {
      const { isEnemyAThreat } = entity.detectEnemyThreat(entity, enemy)
      const isEntityChargeCritical: boolean = entity.detectCriticalCharge(entity)

      // if (isEntityChargeCritical && canSeeEnemy) {
      //   console.log('canSeeEnemy: ', canSeeEnemy)
      // }

      if (entity.currentSpell.charge === 0) {
        /* safeguard against killing itself */
        if (entity.hp < entity.maxHp * 0.3 && entity.mp < entity.currentSpell.mana * 0.6) return

        entity.chargeAttack(entity, enemy)
      }

      if (isEnemyAThreat && !entity.isAwaitingCoverCalculation) {
        // console.log('%c threat detected: ', 'color: darkred', entity.isAwaitingCoverCalculation)
        entity.isAwaitingCoverCalculation = true
        entity.findCoverPosition(entity, enemy).then((coverPosition: Vector3) => {
          // coverPosition calculation returned from web worker
          if (isEntityChargeCritical) {
            // If charge is critical, attack the enemy directly
            console.log('%c isEntityChargeCritical: ', 'background: black; color: white;', isEntityChargeCritical)
            entity.path = null
            moveToTargetPosition(entity, enemy.mesh.position, enemy, true)
            return
          }

          if (isEnemyAThreat) {
            // Move to cover position
            // console.log('goto coverPosition:')
            entity.path = null
            entity.lastCoverPosition = coverPosition

            /* go directly to cover position */
            moveToTargetPosition(entity, coverPosition, enemy, true)
          } else {
            /* move around randomly */
            entity.lastCoverPosition = null
            entity.isAwaitingCoverCalculation = false
          }
        })
      } else if (!entity.lastCoverPosition) {
        // Move around randomly if no cover position is set
        const targetPosition = null // Use a random point in the map
        moveToTargetPosition(entity, targetPosition, enemy)
      }
    }
  }

  let updateEventUuid = ''
  const update = (deltaS: number, elapsedTimeInS: number) => {
    const isFinished = entity.update(deltaS, elapsedTimeInS)
    if (!isFinished) return

    entity.checkBattleOver(updateEventUuid)

    performAgentLogic()

    // Update movement based on AI decisions
    entity.currentVelocity = movementStrategy.calculateVelocity(entity.currentVelocity, deltaS)
  }
  updateEventUuid = $.addEvent('renderer.update', update)

  $.entitiesMap.set(entity.uuid, entity)
  $.enemy = entity

  return entity
}

export default AIController
