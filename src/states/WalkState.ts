import State from '@/states/State'

export default class WalkState extends State {
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'walk'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap['walk'].action
    if (previousState) {
      const previousAction = this.parent.animationsMap[previousState.name].action

      currentAction.enabled = true

      if (previousState.name == 'run') {
        const ratio = currentAction.getClip().duration / previousAction.getClip().duration
        currentAction.time = previousAction.time * ratio
      } else {
        currentAction.time = 0.0
        currentAction.setEffectiveTimeScale(1.0)
        currentAction.setEffectiveWeight(1.0)
      }

      // if (previousState.name == 'jump') {
      //   currentAction.crossFadeFrom(previousAction, 0.01, true)
      //   currentAction.play()
      //   return
      // }
      currentAction.crossFadeFrom(previousAction, 0.5, true)
      currentAction.play()
    } else {
      currentAction.play()
    }
  }

  exit() {}

  update(timeElapsed: number, input: any) {
    // if (input.keysMap.leftMouse) {
    //   this.parent.setState('cast')
    //   return
    // }
    if (input.keysMap.space) {
      this.parent.setState('jump')
      return
    }
    if (input.keysMap.forward || input.keysMap.backward) {
      if (input.keysMap.shift) {
        this.parent.setState('run')
      }
      return
    }

    this.parent.setState('idle')
  }
}
