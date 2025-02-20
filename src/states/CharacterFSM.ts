import { characterAnimationNamesList } from '@/enums/constants.ts'
import FSM from '@/states/FSM.ts'
import IdleState from '@/states/IdleState.ts'
import WalkState from '@/states/WalkState.ts'
import WalkBackState from '@/states/WalkBackState.ts'
import DanceState from '@/states/DanceState.ts'
import RunState from '@/states/RunState.ts'
import RunBackState from '@/states/RunBackState.ts'
import CastState from '@/states/CastState.ts'
import JumpState from '@/states/JumpState.ts'
import FlyState from '@/states/FlyState.ts'
import HitState from '@/states/HitState.ts'
/* the ...State imports are needed for the eval down below */

const modules = import.meta.glob('@/states/*State.ts', { eager: true })

/* auto import all Files ending with State.ts with vite */
const states: Record<string, any> = {}
const list = [IdleState, WalkState, WalkBackState, DanceState, RunState, RunBackState, CastState, JumpState, FlyState, HitState]
for (const path in modules) {
  const moduleName = path.split('/').pop()?.replace('.ts', '') || 'unknown'
  states[moduleName] = (modules[path] as any).default
}

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

        const stateName = `${className}State`
        stateClass = states[stateName]
      } else {
        const stateName = `${name[0].toUpperCase() + name.substring(1)}State`
        stateClass = states[stateName]
      }
      list.forEach((state: any) => {
        const sta = list[0]
      })
      this.addState(name, stateClass)
    })
  }
}
