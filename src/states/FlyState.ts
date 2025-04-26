import State, { isMovingEntity } from '@/states/State'
import { LoopOnce, LoopRepeat } from 'three'

export default class FlyState extends State {
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'fly'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap[this.name]?.action
    if (!currentAction) return

    if (previousState) {
      const previousAction = this.parent.animationsMap[previousState.name].action

      currentAction.enabled = true

      const states = ['jump']
      if (states.includes(previousState.name)) {
        const ratio = currentAction.getClip().duration / previousAction.getClip().duration
        currentAction.time = previousAction.time * ratio
      } else {
        currentAction.time = 0.0
        currentAction.setEffectiveTimeScale(1.0)
        currentAction.setEffectiveWeight(1.0)
      }

      if (previousState.name == 'jump') {
        currentAction.crossFadeFrom(previousAction, 0.01, true)
        currentAction.play()
        return
      }
      currentAction.crossFadeFrom(previousAction, 0.5, true)
      currentAction.setLoop(LoopRepeat)
      // currentAction.clampWhenFinished = true
      currentAction.play()
    } else {
      currentAction.play()
    }
  }

  exit() {}

  update(timeElapsed: number, input: any) {
    if (isMovingEntity(this.parent)) return

    if (!this.parent.owner.isGrounded || this.parent.owner.utils.groundedTime.value > 0.3) return

    // console.log('%cleaving fly state', 'color: green')
    this.parent.setState('idle')
  }
}
