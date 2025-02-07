import { v4 as uuidv4 } from 'uuid'

let state: {
  triggerEvent: (eventName: string) => void
  addEvent: (eventName: string, callback: (a?: any, b?: any) => any, cleanup?: () => any | undefined, sourceName?: string) => string
  removeEvent: (eventName: string, uuid: string) => void
  [key: string]: any /* global objects */
  eventsMap: {
    [key: string]: {
      uuid: string
      callback: () => any
      cleanup?: any
      sourceName?: string
    }[]
  }
} = null

const globalState = () => {
  /* state is a Singleton */
  if (state !== null) {
    return state
  }

  state = {
    eventsMap: {},
  }
  state = {
    triggerEvent: (eventName: string) => {
      state.eventsMap[eventName]?.forEach((event: any) => {
        if (!event) {
          console.warn('Event not found')
          return
        }
        event.callback?.()
        console.log('XXEvent triggered:', eventName)
      })
    },
    addEvent: (eventName: string, callback: () => string, cleanup?: () => any, sourceName?: string) => {
      const uuid = uuidv4()
      if (!state?.eventsMap?.[eventName]) {
        state.eventsMap[eventName] = []
      }
      state?.eventsMap[eventName]?.push({
        uuid,
        callback,
        cleanup,
        sourceName,
      })
      console.log('XXEvent added:', eventName, 'with ', uuid)
      return uuid
    },
    removeEvent: (eventName: string, uuid: string) => {
      const event = state.eventsMap[eventName]
      event.cleanup?.()
      state.eventsMap[eventName] = state.eventsMap[eventName].filter((e: any) => e.uuid !== uuid)
      console.log('XXEvent removed:', eventName, 'with ', uuid)
    },
    eventsMap: {},
  }
  console.log('XXstate: ', state)

  /* init this game state with defaults */
  state.debugPhysics = true
  state.showCursor = false
  state.showCrosshair = true
  state.isThirdPerson = true
  state.isLookBack = false
  state.isPaused = false
  state.canFire = false

  return state
}
const currentState = globalState()
export default currentState
