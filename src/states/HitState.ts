import State, { isMovingEntity } from '@/states/State'
import { LoopOnce } from 'three'
import $ from '@/global'

export default class JumpState extends State {
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'hit'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap[this.name].action
    const mixer = currentAction.getMixer()
    mixer.addEventListener('finished', () => this.onFinished(previousState))

    if (previousState) {
      const previousAction = this.parent.animationsMap[previousState.name].action

      currentAction.enabled = true

      if (previousState.name !== 'idle') {
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

    $.sounds.addAndPlayPositionalSound(this.parent.owner, 'hit', { volume: 0.7 })
  }

  onFinished(previousState: any) {
    this.cleanup()

    if (isMovingEntity(this.parent)) return
    this.parent.setState('idle')
  }

  cleanup() {
    const action = this.parent.animationsMap[this.name].action
    action.getMixer().removeEventListener('finished', () => {})
  }

  exit() {}

  update() {}
}
