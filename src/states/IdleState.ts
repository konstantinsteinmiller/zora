import State, { isMovingEntity, transitionTo } from '@/states/State'
import useMatch from '@/use/useMatch.ts'
import { LEVELS } from '@/utils/enums.ts'
import { LoopRepeat } from 'three'

export default class IdleState extends State {
  private levelType
  constructor(parent: any) {
    super(parent)
    this.levelType = useMatch().levelType.value
  }

  get name() {
    return 'idle'
  }

  enter(previousState: any) {
    const idleAction = this.parent.animationsMap['idle'].action
    if (previousState) {
      const prevAction = this.parent.animationsMap[previousState.name].action
      idleAction.time = 0.0
      idleAction.enabled = true
      idleAction.setEffectiveTimeScale(1.0)
      idleAction.setEffectiveWeight(1.0)
      idleAction.crossFadeFrom(prevAction, 0.5, true)
      idleAction.setLoop(LoopRepeat)
      idleAction.play()
    } else {
      idleAction.play()
    }
  }
  exit() {}
  update(_: any, input: any) {
    if (isMovingEntity(this.parent) || this.levelType === LEVELS.ARENA) return

    // if (transitionTo('cast', this.parent)) return
    if (transitionTo('jump', this.parent)) return
    // transitionTo('walk', this.parent)
    if (input.forward || input.left || input.right) {
      this.parent.setState('walk')
    } else if (input.backward) {
      this.parent.setState('walk-back')
    }
  }
}
