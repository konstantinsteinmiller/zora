import { MIN_FLY_IMPULSE } from '@/enums/constants.ts'
import State, { isMovingEntity } from '@/states/State'

export default class FlyState extends State {
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'fly'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap[this.name].action
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
      currentAction.play()
    } else {
      currentAction.play()
    }
  }

  exit() {}

  update(timeElapsed: number, input: any) {
    if (isMovingEntity(this.parent)) return

    if (!this.parent.owner.isGrounded) return

    this.parent.setState('idle')
  }
}
