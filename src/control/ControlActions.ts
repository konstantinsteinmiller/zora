import { createFairyDustObjects } from '@/entity/FairyDust.ts'
import useInteraction from '@/use/useInteraction.ts'
import useMatch from '@/use/useMatch.ts'
import useUser from '@/use/useUser.ts'
import { FLY_COST, MAX_FLY_IMPULSE } from '@/utils/constants.ts'
import type { ActionFunctionMap } from '@/types/controller-types.ts'
import type { BoolEnum, EnumStringToList } from '@/types/general.ts'
import $ from '@/global'
import { INTERACTIONS, LEVELS, MENU } from '@/utils/enums.ts'
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

const toggleMenu = (hasChanged, menuId) => {
  if ($.menuItem.value === menuId) {
    $.menuItem.value = null
  } else if (hasChanged) {
    $.menuItem.value = menuId
  }
}

export default (defaultControlsConfig: EnumStringToList) => {
  const { levelType } = useMatch()

  const { interactionId, hideInteraction } = useInteraction()
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
        $.triggerEvent('controls.attack1.down')
      },
      onDeactivate: (entity: any) => {
        if (!document.pointerLockElement) return
        $.triggerEvent('controls.attack1.up')
      },
    },
    inventory: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged) {
          levelType.value === LEVELS.ARENA && createFairyDustObjects(3.8 * Math.PI, $.enemy.position)
        }
        toggleMenu(hasChanged, MENU.ITEMS)
      },
      onDeactivate: (entity: any) => {},
    },
    fairyMenu: {
      onActivate: (entity: any, hasChanged: boolean) => {
        toggleMenu(hasChanged, MENU.FAIRY)
      },
      onDeactivate: (entity: any) => {},
    },
    collectionMenu: {
      onActivate: (entity: any, hasChanged: boolean) => {
        toggleMenu(hasChanged, MENU.COLLECTION)
      },
      onDeactivate: (entity: any) => {},
    },
    spellsMenu: {
      onActivate: (entity: any, hasChanged: boolean) => {
        toggleMenu(hasChanged, MENU.ATTACK_SPELLS)
      },
      onDeactivate: (entity: any) => {},
    },
    mapMenu: {
      onActivate: (entity: any, hasChanged: boolean) => {
        toggleMenu(hasChanged, MENU.MAP)
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
    rotateLeft: {
      onActivate: (entity: any, hasChanged: boolean) => {},
      onDeactivate: (entity: any) => {},
    },
    rotateRight: {
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
          const { userSoundVolume } = useUser()
          entity.stateMachine.setState('hit')
          entity.dealDamage(entity, 15)
          entity.dealDamage($.enemy, 115)
          $.sounds.addAndPlayPositionalSound(entity, 'hit', { volume: 0.025 * userSoundVolume.value * 0.25 })
        }
      },
      onDeactivate: (entity: any) => {},
    },
    fly: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (!document.pointerLockElement) return

        const { userSoundVolume } = useUser()
        if (hasChanged && levelType.value === LEVELS.ARENA) {
          if (entity.endurance >= FLY_COST) {
            entity.utils.groundedTime.lastTimeNotGrounded = Date.now()
            entity.guild === 'guild-0' && entity.dealEnduranceDamage(entity, FLY_COST)
            entity.appliedFlyImpulse = MAX_FLY_IMPULSE
            entity.utils.takeOffFrames = 3
            $.sounds.addAndPlayPositionalSound(entity, 'flap', { volume: 0.25 * userSoundVolume.value * 0.25 })
          }
        }
      },
      onDeactivate: (entity: any) => {},
    },
    talk: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if (hasChanged && interactionId.value === INTERACTIONS.TALK) {
          $.isDialog.value = true
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
          $.isPaused = !$.isPaused
          addFairyDust(5)
          $.controls.removePointerLock()
          /* print the current position of the player mesh and save it as Vector3 to clipboard */
          const pos = $.player.mesh.position
          const groupId = $.level.pathfinder.getGroup($.level.zone, pos)
          const closest = $.level.pathfinder.getClosestNode(pos, $.level.zone, groupId, true)
          closest &&
            console.log('pos: ', pos, 'closest?.centroid:', JSON.stringify(closest?.centroid, undefined, 2), groupId)
          navigator.clipboard.writeText(JSON.stringify($.player.mesh.position, undefined, 2))

          console.log(JSON.stringify($.player.mesh.quaternion, undefined, 2))
        }
      },
      onDeactivate: (entity: any) => {},
    },
    lookBack: {
      onActivate: (entity: any, hasChanged: boolean) => {
        $.isThirdPerson = false
        $.showCrosshair = false
        $.controls.toggleCursor(false)
        document.querySelector('.game')?.classList.remove('cursor--hidden')
      },
      onDeactivate: (entity: any) => {
        $.showCrosshair = true
        $.controls.toggleCursor(true)
        document.querySelector('.game')?.classList?.add('cursor--hidden')
      },
    },
    toggleCamera: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if ($.input.keysMap['ControlLeft']) return

        if (hasChanged) {
          $.isThirdPerson = !$.isThirdPerson
          // $.camera.updateCameraRotation()
        }
        $.controls.lookBack = false
        $.showCrosshair = true
      },
      onDeactivate: (entity: any) => {},
    },
    moveToTargetPosition: {
      onActivate: (entity: any, hasChanged: boolean) => {
        $.player.path = null
        moveToTargetPosition($.player, null, null)
      },
      onDeactivate: (entity: any) => {},
    },
    toggleDebug: {
      onActivate: (entity: any, hasChanged: boolean) => {
        $.enableDebug = !$.enableDebug
      },
      onDeactivate: (entity: any) => {},
    },
    esc: {
      onActivate: (entity: any, hasChanged: boolean) => {
        if ($.menuItem.value !== null) {
          $.menuItem.value = null
        } else {
          $.isPaused = !$.isPaused
          $.isPauseMenu.value = !$.isPauseMenu.value
        }
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
