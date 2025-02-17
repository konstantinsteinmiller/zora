import { characterAnimationNamesList } from '@/enums/constants.ts'
import FSM from '@/states/FSM.ts'
import type State from '@/states/State.ts'
import IdleState from '@/states/IdleState.ts'
import WalkState from '@/states/WalkState.ts'
import WalkBackState from '@/states/WalkBackState.ts'
import DanceState from '@/states/DanceState.ts'
import RunState from '@/states/RunState.ts'
import RunBackState from '@/states/RunBackState.ts'
import CastState from '@/states/CastState.ts'
import JumpState from '@/states/JumpState.ts'
import state from '@/states/GlobalState'
/* the ...State imports are needed for the eval down below */

export default class CharacterFSM extends FSM {
  animationsMap: { [key: string]: any }

  constructor(animationsMap: { [key: string]: any }, owner: any) {
    super()
    this.owner = owner
    this.animationsMap = animationsMap

    const animationsList: string[] = characterAnimationNamesList
    animationsList.forEach((name: string) => {
      let stateClass
      if (name.includes('-')) {
        const p = name.split('-')
        const className = `${p[0][0].toUpperCase()}${p[0].substring(1)}${p[1][0].toUpperCase()}${p[1].substring(1)}`

        stateClass = eval(`${className}State`) as State
      } else {
        stateClass = eval(`${name[0].toUpperCase() + name.substring(1)}State`) as State
      }
      this.addState(name, stateClass)
    })
  }
}
