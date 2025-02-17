import state from '@/states/GlobalState.ts'

export default class State {
  parent: any
  isPlayer: boolean

  constructor(parent: any) {
    this.parent = parent
    this.isPlayer = parent.owner.name === 'player'
  }

  enter(previousState: any) {}
  exit() {}
  update(_: any, input: any) {}
}

const transitionMap: { [key: string]: string[] } = {
  walk: ['forward', '!shift'],
  'walk-back': ['backward', '!shift'],
  run: ['forward', 'shift'],
  'run-back': ['backward', 'shift'],
  cast: ['attack'],
  jump: ['space'],
}

export const isMovingEntity = (parent: any) => state.level.movingEntitiesList?.includes(parent.owner.name)
export const transitionTo = (stateName: string, parent: any) => {
  const keyNamesList = transitionMap[stateName]
  const condition = keyNamesList?.every((keyName: string) => {
    if (keyName.startsWith('!')) {
      return !state.input.keysMap[keyName.slice(1)]
    }
    return state.input.keysMap[keyName]
  })

  if (condition) {
    parent.setState(stateName)
    return true
  }
  if (state.input.keysMap[keyNamesList[0]]) {
    return true
  }
  return false
}
