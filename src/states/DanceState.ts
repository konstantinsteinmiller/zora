import State from '@/states/State'
import * as THREE from 'three'

export default class DanceState extends State {
  constructor(parent: any) {
    super(parent)
  }

  get name() {
    return 'dance'
  }

  enter(previousState: any) {
    const currentAction = this.parent.animationsMap['dance'].action
    const mixer = currentAction.getMixer()
    mixer.addEventListener('finished', this.onFinished.bind(this))

    if (previousState) {
      const previousAction = this.parent.animationsMap[previousState.name].action

      currentAction.reset()
      currentAction.setLoop(THREE.LoopOnce, 1)
      currentAction.clampWhenFinished = true
      currentAction.crossFadeFrom(previousAction, 0.2, true)
      currentAction.play()
    } else {
      currentAction.play()
    }
  }

  onFinished() {
    this.cleanup()
    this.parent.setState('idle')
  }

  cleanup() {
    const action = this.parent.animationsMap['dance'].action
    action.getMixer().removeEventListener('finished', () => {})
  }

  exit() {
    this.cleanup()
  }

  update() {}
}
