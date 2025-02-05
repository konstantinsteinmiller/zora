import FSM from '@/states/FSM.ts'
import type State from '@/states/State.ts'
import IdleState from '@/states/IdleState.ts'
import WalkState from '@/states/WalkState.ts'
import DanceState from '@/states/DanceState.ts'
import RunState from '@/states/RunState.ts'
import CastState from '@/states/CastState.ts'
import JumpState from '@/states/JumpState.ts'
/* the ...State imports are needed for the eval down below */

export default class CharacterFSM extends FSM {
  animationsMap: { [key: string]: any }

  constructor(animationsMap: { [key: string]: any }) {
    super()
    this.animationsMap = animationsMap

    const animationsList: string[] = ['idle', 'walk', 'run', 'dance', 'cast', 'jump']
    animationsList.forEach((name: string) => {
      this.addState(name, eval(`${name[0].toUpperCase() + name.substring(1)}State`) as State)
    })
  }
}
