import FSM from '@/states/FSM.ts'
import FlyState from '@/states/FlyState.ts'
import IdleState from '@/states/IdleState.ts'
import { fairyAnimsList } from '@/utils/constants.ts'
/* the ...State imports are needed for the eval down below */

const modules = import.meta.glob('@/states/*State.ts', { eager: true })

/* auto import all Files ending with State.ts with vite */
const states: Record<string, any> = {}
const list = [IdleState, FlyState]
for (const path in modules) {
  const moduleName = path.split('/').pop()?.replace('.ts', '') || 'unknown'
  states[moduleName] = (modules[path] as any).default
}

export default class FairyCharacterFSM extends FSM {
  animationsMap: { [key: string]: any }

  constructor(animationsMap: { [key: string]: any }, owner: any) {
    super()
    this.owner = owner
    this.animationsMap = animationsMap

    const animationsList: string[] = fairyAnimsList
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

      /* this is needed so the imports are used */
      list.forEach((state: any) => {
        const sta = state
      })
      this.addState(name, stateClass)
    })
  }
}
