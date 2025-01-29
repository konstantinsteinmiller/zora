import State from '@/states/State'
import { LoopOnce } from 'three'

export default class JumpState extends State {
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'jump'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap['jump'].action
    const mixer = currentAction.getMixer()
    mixer.addEventListener('finished', () => this.onFinished(previousState))

    if (previousState) {
      const previousAction = this.parent.animationsMap[previousState.name].action

      currentAction.enabled = true

      if (previousState.name === 'walk' || previousState.name === 'run') {
        const ratio = currentAction.getClip().duration / previousAction.getClip().duration
        currentAction.time = previousAction.time * ratio
      } else {
        currentAction.time = 0.0
        currentAction.setEffectiveTimeScale(1.0)
        currentAction.setEffectiveWeight(1.0)
      }

      currentAction.reset()
      currentAction.setLoop(LoopOnce, 1)
      currentAction.clampWhenFinished = true
      currentAction.crossFadeFrom(previousAction, 0.2, true)
      currentAction.play()
    } else {
      currentAction.play()
    }
  }

  onFinished(previousState: any) {
    const input = window.playerInput
    this.cleanup()

    // if (previousState) {
    //   this.parent.setState(previousState.name)
    //   return
    // }
    if (input.keysMap.forward || input.keysMap.backward) {
      if (!input.keysMap.shift) {
        this.parent.setState('walk')
      } else {
        this.parent.setState('run')
      }
      return
    }
    this.parent.setState('idle')
  }

  cleanup() {
    const action = this.parent.animationsMap['jump'].action
    action.getMixer().removeEventListener('finished', () => {})
  }

  exit() {}

  update() {}
}
