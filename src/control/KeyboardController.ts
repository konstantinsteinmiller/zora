import ControlActions, { getPrefilledActionsMap } from '@/control/ControlActions.ts'
import { LOOK_AROUND_SPEED } from '@/enums/constants.ts'
import state from '@/states/GlobalState'
import type { ActionFunctionMap } from '@/types/controller-types.ts'
import type { BoolEnum, Enum, EnumStringToList } from '@/types/general.ts'

let input: {
  keysMap: BoolEnum
  actions: ActionFunctionMap
  actionsMap: { [action: string]: boolean | BoolEnum; previous: BoolEnum }
  mouse: {
    current: { [key: string]: number }
    previous: { [key: string]: number } | null
  }
  updateControlsConfig: (newConfig: Partial<Enum>) => void
} = {}

// Default key bindings
const defaultControlsConfig: EnumStringToList = {
  activate: ['KeyE'],
  interact: ['KeyF'],
  attack: ['Mouse0'],
  inventory: ['KeyI'],
  forward: ['KeyW'],
  backward: ['KeyS'],
  left: ['KeyA'],
  right: ['KeyD'],
  jump: ['Mouse2'],
  fly: ['Mouse2'],
  hit: ['Mouse1'],
  sprint: ['ShiftLeft'],
  pause: ['KeyP'],
  lookBack: ['KeyG'],
  toggleCamera: ['KeyH'],
  moveToTargetPosition: ['ControlLeft', 'KeyV'],
  toggleDebug: ['ControlLeft', 'KeyC'],
}
let controlsConfig = JSON.parse(JSON.stringify(defaultControlsConfig))

export default () => {
  if (input?.mouse?.current) return input

  const prefilledActionsMap = getPrefilledActionsMap(defaultControlsConfig)
  input = {
    keysMap: {
      //   KeyW: false,
      //   KeyS: true,
    },
    actions: {
      ...ControlActions(defaultControlsConfig),
      /* interact: {
        onActivate: () => {},
        onDeactivate: () => {}
      }, ... */
    },
    actionsMap: {
      previous: {
        ...prefilledActionsMap,
        /* 'activate': false , 'interact': false... */
      },
      ...prefilledActionsMap,
      /* 'activate': false , 'interact': false... */
    },
    mouse: {
      current: {
        mouseX: 0,
        mouseY: 0,
        mouseXDelta: 0,
        mouseYDelta: 0,
        crosshairX: (innerWidth / 2 / innerWidth) * 2 - 1,
        crosshairY: -(innerHeight / 2 / innerHeight) * 2 + 1,
      },
      previous: null,
    },
    updateControlsConfig: (newConfig: Partial<Enum>) => {
      controlsConfig = { ...controlsConfig, ...newConfig }
    },
  }

  const setAction = (code: string) => {
    for (const action in controlsConfig) {
      const list: string[] = controlsConfig[action]
      if (list.includes(code)) {
        /* set previous action to current action state, then update the current action state */
        input.actionsMap.previous[action] = input.actionsMap[action]
        input.actionsMap[action] = list.every((key: string) => input.keysMap[key])

        const hasChanged = input.actionsMap[action] !== input.actionsMap.previous[action]
        input.actionsMap[action] /*
         */
          ? input.actions[action]?.onActivate?.(state.player, hasChanged)
          : input.actions[action]?.onDeactivate?.(state.player)
      }
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    input.keysMap[`Mouse${event.button}`] = true
    setAction(`Mouse${event.button}`)
    // case 0: // left mouse button
    // case 1: // cursor wheel button
    // case 2: // right mouse button
    // case 3: // navigate forward
    // case 4: // navigate back
  }
  const onMouseUp = (event: MouseEvent) => {
    input.keysMap[`Mouse${event.button}`] = false
    setAction(`Mouse${event.button}`)
  }

  const preventedKeyDownEventsList = ['Space']
  const preventedControlCommandsList = ['KeyA', 'KeyS', 'KeyD', 'KeyF']
  const onKeyDown = (event: KeyboardEvent) => {
    // state.enableDebug && console.log('event.code: ', event.code, event.keyCode)
    if (preventedKeyDownEventsList.includes(event.code)) event.preventDefault()
    if (event.ctrlKey && preventedControlCommandsList.includes(event.code)) event.preventDefault()

    input.keysMap[event.code] = true
    setAction(event.code)
  }

  const onKeyUp = (event: KeyboardEvent) => {
    input.keysMap[event.code] = false
    setAction(event.code)
  }

  const onMouseMove = (event: MouseEvent) => {
    input.mouse.current.mouseX = event.pageX - innerWidth / 2
    input.mouse.current.mouseY = event.pageY - innerHeight / 2
    input.mouse.current.crosshairX = (event.clientX / innerWidth) * 2 - 1
    input.mouse.current.crosshairY = -(event.clientY / innerHeight) * 2 + 1

    if (input.mouse.previous === null) {
      input.mouse.previous = {
        ...input.mouse.current,
      }
    }
    input.mouse.current.mouseXDelta = input.mouse.current.mouseX - input.mouse.previous.mouseX
    input.mouse.current.mouseYDelta = input.mouse.current.mouseY - input.mouse.previous.mouseY
  }

  const update = () => {
    if (input.mouse.previous !== null) {
      input.mouse.current.mouseXDelta = input.mouse.current.mouseX - input.mouse.previous.mouseX
      input.mouse.current.mouseYDelta = input.mouse.current.mouseY - input.mouse.previous.mouseY
      if (input.mouse.current.mouseX === -innerWidth / 2) {
        input.mouse.current.mouseXDelta = -LOOK_AROUND_SPEED
      }
      if (input.mouse.current.mouseX >= innerWidth / 2 - 1) {
        input.mouse.current.mouseXDelta = LOOK_AROUND_SPEED
      }

      input.mouse.previous = { ...input.mouse.current }
    }
  }

  state.addEvent(
    'renderer.update',
    () => {
      update()
    },
    () => {},
    'input'
  )

  document.addEventListener('keydown', e => onKeyDown(e), false)
  document.addEventListener('keyup', e => onKeyUp(e), false)
  document.addEventListener('contextmenu', e => e.preventDefault(), false)
  document.addEventListener('mousedown', e => onMouseDown(e), false)
  document.addEventListener('mouseup', e => onMouseUp(e), false)
  document.addEventListener('pointermove', e => onMouseMove(e), false)

  state.input = input
  state.controls = input.actionsMap
  state.controls.mouse = input.mouse
  state.controls.keysMap = input.keysMap

  return input
}

/*
const KeyboardKeys = [
  'IntlBackslash',
  'Digit1',
  'Digit2',
  'Digit3',
  'Digit4',
  'Digit5',
  'Digit6',
  'Digit7',
  'Digit8',
  'Digit9',
  'Digit0',
  'Minus',
  'Equal',
  'Backspace',
  'Tab',
  'KeyQ',
  'KeyW',
  'KeyE',
  'KeyR',
  'KeyT',
  'KeyY',
  'KeyU',
  'KeyI',
  'KeyO',
  'KeyP',
  'BracketLeft',
  'BracketRight',
  'Enter',
  'CapsLock',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyF',
  'KeyG',
  'KeyH',
  'KeyJ',
  'KeyK',
  'KeyL',
  'Semicolon',
  'Quote',
  'Backslash',
  'ShiftLeft',
  'Backquote',
  'KeyZ',
  'KeyX',
  'KeyC',
  'KeyV',
  'KeyB',
  'KeyN',
  'KeyM',
  'Comma',
  'Period',
  'Slash',
  'ShiftRight',
  'ControlLeft',
  'AltLeft',
  'MetaLeft',
  'MetaRight',
  'AltRight',
  'ControlRight',
  'Space',
  'Numpad1',
  'Numpad2',
  'Numpad3',
  'Numpad6',
  'Numpad5',
  'Numpad4',
  'Numpad7',
  'Numpad8',
  'Numpad9',
  'NumLock',
  'NumpadEqual',
  'NumpadDivide',
  'NumpadMultiply',
  'NumpadSubtract',
  'NumpadAdd',
  'NumpadEnter',
  'Numpad0',
  'NumpadDecimal',
  'Delete',
  'End',
  'Home',
  'PageUp',
  'PageDown',
]
*/
