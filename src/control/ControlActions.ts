import { FLY_IMPULSE } from '@/enums/constants.ts'
import type { ActionFunctionMap } from '@/types/controller-types.ts'
import type { BoolEnum, EnumStringToList } from '@/types/general.ts'
import state from '@/states/GlobalState'
import { moveToRandomPosition } from '@/utils/navigation.ts'

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
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {
        state.triggerEvent('input.attack1.up')
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
    fly: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          entity.appliedFlyImpulse = FLY_IMPULSE
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
          /* print the current position of the player mesh and save it as Vector3 to clipboard */
          console.log('pos: ', state.player.mesh.position)
          navigator.clipboard.writeText(JSON.stringify(state.player.mesh.position, undefined, 2))
        }
      },
      onDeactivate: (entity: any) => {},
    },
    lookBack: {
      onActivate: (entity: any, hasChanged: boolean) => {
        state.isThirdPerson = false
        state.showCrosshair = false
        document.querySelector('.game')?.classList.remove('cursor--hidden')
      },
      onDeactivate: (entity: any) => {
        state.showCrosshair = true
        document.querySelector('.game')?.classList?.add('cursor--hidden')
      },
    },
    toggleCamera: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          state.isThirdPerson = !state.isThirdPerson
        }
        state.controls.lookBack = false
        state.showCrosshair = true
      },
      onDeactivate: (entity: any) => {},
    },
    moveToRandomPosition: {
      onActivate: (entity: any, hasChanged: boolean) => {
        state.level.pathfinder.isMoving = false
        moveToRandomPosition(state.player, null)
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
    moveToRandomPosition: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    toggleDebug: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
  }*/
}
