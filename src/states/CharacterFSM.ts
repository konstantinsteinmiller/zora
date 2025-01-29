import FSM from '@/states/FSM.ts'
import IdleState from '@/states/IdleState.ts'
import WalkState from '@/states/WalkState.ts'
import DanceState from '@/states/DanceState.ts'
import RunState from '@/states/RunState.ts'
import CastState from '@/states/CastState.ts'
import JumpState from '@/states/JumpState.ts'

export default class CharacterFSM extends FSM {
  animationsMap: { [key: string]: any }

  constructor(animationsMap: { [key: string]: any }) {
    super()
    this.animationsMap = animationsMap

    this.addState('idle', IdleState)
    this.addState('walk', WalkState)
    this.addState('run', RunState)
    this.addState('dance', DanceState)
    this.addState('cast', CastState)
    this.addState('jump', JumpState)
  }
}
