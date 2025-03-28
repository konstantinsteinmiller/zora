import { MIN_FLY_IMPULSE } from '@/utils/constants.ts'
import State, { isMovingEntity } from '@/states/State'
import { LoopOnce } from 'three'
import $ from '@/global'

export default class JumpState extends State {
  counter: number = 0
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'jump'
  }

  enter(previousState: any) {
    if (!this.parent.animationsMap['jump'].action) return
    const currentAction = this.parent.animationsMap['jump'].action
    const mixer = currentAction.getMixer()
    mixer.addEventListener('finished', () => this.onFinished(previousState))
    this.counter = 0
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
    this.cleanup()

    // if (previousState) {
    //   this.parent.setState(previousState.name)
    //   return
    // }

    if (isMovingEntity(this.parent)) return

    if ($.controls.forward) {
      if (!$.controls.sprint) {
        this.parent.setState('walk')
        return
      }
      this.parent.setState('run')
      return
    }
    if ($.controls.backward) {
      if (!$.controls.sprint) {
        this.parent.setState('walk-back')
        return
      }
      this.parent.setState('run-back')
      return
    }
    this.parent.setState('idle')
  }

  cleanup() {
    const action = this.parent.animationsMap['jump'].action
    action.getMixer().removeEventListener('finished', () => {})
  }

  exit() {}

  update() {
    if (this.parent.owner.appliedFlyImpulse > MIN_FLY_IMPULSE) {
      this.parent.setState('fly')
    }
  }
}
