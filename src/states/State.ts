import $ from '@/global'

export default class State {
  parent: any
  isPlayer: boolean

  constructor(parent: any) {
    this.parent = parent
    this.isPlayer = parent.owner.guild === 'guild-0'
  }

  enter(previousState: any) {}
  exit() {}
  update(_: any, input: any) {}
}

const transitionMap: { [key: string]: string[][] } = {
  walk: [
    ['forward', '!sprint'],
    ['left', '!sprint'],
    ['right', '!sprint'],
  ],
  'walk-back': [['backward', '!sprint']],
  run: [
    ['forward', 'sprint'],
    ['left', 'sprint'],
    ['right', 'sprint'],
  ],
  'run-back': [['backward', 'sprint']],
  cast: [['attack']],
  jump: [['jump']],
}

export const isMovingEntity = (parent: any) => parent.owner.isMoving
export const transitionTo = (stateName: string, parent: any) => {
  const keyNamesMatrix = transitionMap[stateName]
  const condition = keyNamesMatrix.some((keyNamesList: string[]) => {
    return keyNamesList?.every((keyName: string) => {
      if (keyName.startsWith('!')) {
        return !$.controls[keyName.slice(1)]
      }
      return $.controls[keyName]
    })
  })

  if (condition) {
    parent.setState(stateName)
    return true
  }
  if ($.controls[keyNamesMatrix[0][0]]) {
    return true
  }
  return false
}
