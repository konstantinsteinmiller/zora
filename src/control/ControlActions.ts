import camera from '@/engine/Camera.ts'
import { FLY_COST, MAX_FLY_IMPULSE, MIN_FLY_IMPULSE } from '@/utils/constants.ts'
import type { ActionFunctionMap } from '@/types/controller-types.ts'
import type { BoolEnum, EnumStringToList } from '@/types/general.ts'
import state from '@/states/GlobalState'
import { moveToTargetPosition } from '@/utils/navigation.ts'

/* set all actions initially to false */
export const getPrefilledActionsMap = (defaultControlsConfig: EnumStringToList) => {
  return Object.keys(defaultControlsConfig).reduce((acc: BoolEnum, cur: string) => {
    acc[cur] = false
    return acc
  }, {})
}

/* generates an action to onActive/onDeactivate map for prefilling */
export const getActionEventsMap = (defaultControlsConfig: EnumStringToList) => {
  const map: ActionFunctionMap = Object.keys(defaultControlsConfig).reduce((acc: ActionFunctionMap, cur: string) => {
    acc[cur] = {
      // onActivate: null /* set null so that we can detect missed implementations */,
      // onDeactivate: null /* set null so that we can detect missed implementations */,
      onActivate: '(entity: any) => {}',
      onDeactivate: '(entity: any) => {}',
    }
    return acc
  }, {})
  console.log(JSON.stringify(JSON.parse(JSON.stringify(map)), undefined, 2))
  return map
  /* interact: {
    onActivate: () => {},
    onDeactivate: () => {}
  }, ... */
}

/* actions is a Singleton */
const actions = null
export default (defaultControlsConfig: EnumStringToList) => {
  if (actions !== null) return actions

  // const map = getActionEventsMap(defaultControlsConfig)
  const map: ActionFunctionMap = {
    activate: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    interact: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    attack: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (!(hasChanged && document.pointerLockElement)) return
        state.triggerEvent('controls.attack1.down')
      },
      onDeactivate: (entity: any) => {
        if (!state.isPointerLocked) return
        state.triggerEvent('controls.attack1.up')
      },
    },
    inventory: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          // entity.toggleInventory()
        }
      },
      onDeactivate: (entity: any) => {},
    },
    forward: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    backward: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    left: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    right: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    jump: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    hurt: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          entity.stateMachine.setState('hit')
          entity.dealDamage(entity, 15)
          state.sounds.addAndPlayPositionalSound(entity, 'hit', { volume: 0.7 })
        }
      },
      onDeactivate: (entity: any) => {},
    },
    fly: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (!document.pointerLockElement) return
        if (hasChanged) {
          if (entity.endurance >= FLY_COST) {
            entity.utils.groundedTime.lastTimeNotGrounded = Date.now()
            entity.name === 'player' && entity.dealEnduranceDamage(entity, FLY_COST)
            entity.appliedFlyImpulse = MAX_FLY_IMPULSE
            entity.utils.takeOffFrames = 3
            state.sounds.addAndPlayPositionalSound(entity, 'flap', { volume: 0.05 })
          }
        }
      },
      onDeactivate: (entity: any) => {},
    },
    hit: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          entity.stateMachine.setState('hit')
        }
      },
      onDeactivate: (entity: any) => {},
    },
    sprint: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    pause: {
      onActivate: (entity: any, hasChanged: boolean) => {
        /* do once */
        if (hasChanged) {
          state.isPaused = !state.isPaused
          state.controls.removePointerLock()
          /* print the current position of the player mesh and save it as Vector3 to clipboard */
          const pos = state.player.mesh.position
          const groupId = state.level.pathfinder.getGroup(state.level.zone, pos)
          const closest = state.level.pathfinder.getClosestNode(pos, state.level.zone, groupId, true)
          closest &&
            console.log('pos: ', pos, 'closest?.centroid:', JSON.stringify(closest?.centroid, undefined, 2), groupId)
          navigator.clipboard.writeText(JSON.stringify(state.player.mesh.position, undefined, 2))

          console.log(JSON.stringify(state.player.mesh.quaternion, undefined, 2))
          window.onceDebug = false
        }
      },
      onDeactivate: (entity: any) => {},
    },
    lookBack: {
      onActivate: (entity: any, hasChanged: boolean) => {
        state.isThirdPerson = false
        state.showCrosshair = false
        state.controls.toggleCursor(false)
        document.querySelector('.game')?.classList.remove('cursor--hidden')
      },
      onDeactivate: (entity: any) => {
        state.showCrosshair = true
        state.controls.toggleCursor(true)
        document.querySelector('.game')?.classList?.add('cursor--hidden')
      },
    },
    toggleCamera: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          state.isThirdPerson = !state.isThirdPerson
          state.camera.updateCameraRotation()
        }
        state.controls.lookBack = false
        state.showCrosshair = true
      },
      onDeactivate: (entity: any) => {},
    },
    moveToTargetPosition: {
      onActivate: (entity: any, hasChanged: boolean) => {
        state.player.path = null
        moveToTargetPosition(state.player, null, null)
      },
      onDeactivate: (entity: any) => {},
    },
    toggleDebug: {
      onActivate: (entity: any, hasChanged: boolean) => {
        state.enableDebug = !state.enableDebug
      },
      onDeactivate: (entity: any) => {},
    },
  }

  Object.keys(defaultControlsConfig).forEach((action: string) => {
    if (typeof map[action].onActivate === 'string') {
      console.warn(`Missing implementation for action: ${action}`)
    }
  })
  // console.log('map: ', map)
  return map /*{
    activate: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    interact: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    attack: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    inventory: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    forward: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    backward: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    left: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    right: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    jump: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    fly: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    sprint: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    pause: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    lookBack: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    toggleCamera: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    moveToTargetPosition: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    toggleDebug: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
  }*/
}
