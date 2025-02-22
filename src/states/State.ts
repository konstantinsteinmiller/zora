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
  walk: ['forward', '!sprint'],
  'walk-back': ['backward', '!sprint'],
  run: ['forward', 'sprint'],
  'run-back': ['backward', 'sprint'],
  cast: ['attack'],
  jump: ['jump'],
}

export const isMovingEntity = (parent: any) => parent.owner.isMoving
export const transitionTo = (stateName: string, parent: any) => {
  const keyNamesList = transitionMap[stateName]
  const condition = keyNamesList?.every((keyName: string) => {
    if (keyName.startsWith('!')) {
      return !state.controls[keyName.slice(1)]
    }
    return state.controls[keyName]
  })

  if (condition) {
    parent.setState(stateName)
    return true
  }
  if (state.controls[keyNamesList[0]]) {
    return true
  }
  return false
}
