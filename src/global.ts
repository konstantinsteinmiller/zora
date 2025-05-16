import { useKeyboard } from '@/use/useKeyboard.ts'
import { type MenuItem } from '@/utils/enums.ts'
import { LoadingManager } from 'three'
import { v4 as uuidv4 } from 'uuid'
import { computed, type ComputedRef, type Ref, ref, watch } from 'vue'
import type { Option } from '@/types/dialog.ts'
import '@/use/useWorldState'

const loadingManager = new LoadingManager()

export interface Global {
  triggerEvent: (eventName: string, uuid?: string) => void
  addEvent: (
    eventName: string,
    callback: (a: any, b: any, c: any, d: any) => void,
    cleanup?: () => any | undefined,
    sourceName?: string
  ) => string
  removeEvent: (eventName: string, uuid: string) => void
  clearAllEvents: () => void
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  /* global objects */
  [key: string]: any
  eventsMap: {
    [key: string]: {
      uuid: string
      callback: (a?: any) => any
      cleanup?: any
      sourceName?: string
    }[]
  }
  oneTimeEventsList: {
    eventName: string
    uuid: string
    callback: () => any
    cleanup?: any
  }[]
  entitiesMap: Map<string, any>
  level: {
    name: string
    zone: string
    pathfinder: any
    movingEntitiesList: string[]
  }
  trainer: any
  player: any
  enemy: any
  hitTarget: Ref<any>
  loadingManager: any
  physics: any
  options: any
  isDialog: Ref<boolean>
  menuItem: Ref<MenuItem | null>
  isPauseMenu: Ref<boolean>
  isDispel: Ref<boolean>
  isMenu: ComputedRef<boolean>
  dialogSelf: Ref<any>
  targetToFocus: Ref<any>
  importantDialog: Ref<Option[]>
  route: Ref<any>
  world: any
}

let global: Global = null

const globalState = () => {
  /* state is a Singleton */
  if (global !== null) {
    return global
  }

  /* needed for e.g. triggerEvent... */
  global = {
    eventsMap: {},
  }
  global = {
    triggerEvent: (eventName: string, uuid?: string) => {
      global.eventsMap[eventName]?.forEach((event: any) => {
        event.callback?.(uuid)
        // console.log('XXEvent triggered:', eventName)
      })
    },
    addOneTimeEvent: (eventName: string, callback: () => string) => {
      const uuid = uuidv4()
      global.oneTimeEventsList?.push({
        eventName,
        uuid,
        cleanup: () => {
          global.oneTimeEventsList = global.oneTimeEventsList.filter((e: any) => e.uuid !== uuid)
        },
        callback,
      })
    },
    addEvent: (eventName: string, callback: () => string, cleanup?: () => any, sourceName?: string): string => {
      const uuid = uuidv4()
      if (!global?.eventsMap?.[eventName]) {
        global.eventsMap[eventName] = []
      }
      global?.eventsMap[eventName]?.push({
        uuid,
        callback,
        cleanup,
        sourceName,
      })
      // console.log('XXEvent added:', eventName, 'with ', uuid)
      return uuid
    },
    removeEvent: (eventName: string, uuid: string) => {
      // const event = $.eventsMap[eventName]
      // event.cleanup?.()
      global.eventsMap[eventName] = global.eventsMap?.[eventName]?.filter((e: any) => e.uuid !== uuid)
      // console.log('XXEvent removed:', eventName, 'with ', uuid)
    },
    clearAllEvents: () => {
      global.eventsMap = {}
      global.oneTimeEventsList = []
    },
    eventsMap: {},
    oneTimeEventsList: [],
    entitiesMap: new Map(),
    trainer: {},
    player: {},
    enemy: {},
    hitTarget: ref(null),
    loadingManager: loadingManager,
    options: {
      coloredUI: false,
      keyboardBindings: {},
      showAdvancedTutorials: false,
    },
    isDialog: ref(false),
    menuItem: ref(null),
    isPauseMenu: ref(false),
    isDispel: ref(false),
    isMenu: computed(() => global.isDialog.value || global.isDispel.value || global.isPauseMenu.value),
    dialogSelf: ref(null),
    targetToFocus: ref(null),
    importantDialog: ref([]),
    isBattleStarting: ref(false),
    route: ref(null),
    world: {},
  }
  // console.log('XXstate: ', state)

  /* init this game state with defaults */
  global.enableWater = true
  global.enableDebug = false
  // global.enableDebug = true
  // global.debugPhysics = true

  global.showCursor = true
  global.showCrosshair = true
  global.isThirdPerson = true
  global.isPaused = false
  global.canFlee = true
  global.fledGame = false
  global.isBattleOver = false
  global.isEngineInitialized = false
  global.isWorldInitialized = false
  global.vfxList = []

  const { clearKeysMap } = useKeyboard()
  watch(global.isMenu, (newValue, oldValue) => {
    if (newValue !== oldValue) {
      if (global?.controls) {
        global.controls.keysMap = {}
        clearKeysMap()
      }
    }

    /* toggle pointer on menu change */
    if (newValue) {
      global.controls.removePointerLock()
    } else if (global?.controls) {
      global.dialogSelf.value = null
      global.targetToFocus.value = null
      !document.pointerLockElement && global.controls.setPointerLock()
    }
  })
  return global
}
const currentState = globalState()
export default currentState

export const getEntity = (uuid: string) => {
  return global.entitiesMap.get(uuid)
}

export const getNpc = (id: string): any | null => {
  const entityIterator = global.entitiesMap[Symbol.iterator]()
  for (const item of entityIterator) {
    const value = item[1]

    if (value?.id === id) {
      return value
    }
  }
  return null
}

export const getWorldPlayer = () => {
  return global.trainer
}
