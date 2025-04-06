import { useKeyboard } from '@/use/useKeyboard.ts'
import { LoadingManager } from 'three'
import { v4 as uuidv4 } from 'uuid'
import { computed, type Ref, ref, watch } from 'vue'

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
  loadingManager: any
  physics: any
  isDialog: Ref<boolean>
  isMenu: Ref<boolean>
  dialogSelf: any
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
    loadingManager: loadingManager,
    isDialog: ref(false),
    isMenu: computed(() => global.isDialog.value),
    dialogSelf: null,
  }
  // console.log('XXstate: ', state)

  /* init this game state with defaults */
  global.enableWater = true
  global.enableDebug = false
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
      global.controls.keysMap = {}
      clearKeysMap()
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
