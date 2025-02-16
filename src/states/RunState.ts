import State from '@/states/State'
import state from '@/states/GlobalState.ts'

export default class RunState extends State {
  isPlayer: boolean

  constructor(parent: any) {
    super(parent)
    this.isPlayer = parent.owner.name === 'player'
  }

  get name() {
    return 'run'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap['run'].action
    if (previousState) {
      const previousAction = this.parent.animationsMap[previousState.name].action

      currentAction.enabled = true

      if (previousState.name == 'walk') {
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

    if (state.level.movingEntitiesList?.includes(this.parent.owner.name)) {
      return
    }

    if (input.keysMap.space && this.isPlayer) {
      this.parent.setState('jump')
      return
    }
    if (input.keysMap.forward || (input.keysMap.backward && this.isPlayer)) {
      if (!input.keysMap.shift && this.isPlayer) {
        this.parent.setState('walk')
      }
      return
    }

    this.parent.setState('idle')
  }
}
