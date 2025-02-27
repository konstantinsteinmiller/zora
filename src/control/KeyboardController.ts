import ControlActions, { getPrefilledActionsMap } from '@/control/ControlActions.ts'
import { LOOK_AROUND_SPEED, Options } from '@/enums/constants.ts'
import state from '@/states/GlobalState'
import type { ActionFunctionMap } from '@/types/controller-types.ts'
import type { BoolEnum, Enum, EnumStringToList } from '@/types/general.ts'

let input: {
  keysMap: BoolEnum
  actions: ActionFunctionMap
  actionsMap: { [action: string]: boolean | BoolEnum; previous: BoolEnum }
  mouse: { [key: string]: number }
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
  hurt: ['Mouse1'],
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
  if (input?.mouse) return input

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
      mouseX: 0,
      mouseY: 0,
      mouseXDelta: 0,
      mouseYDelta: 0,
      crosshairX: (innerWidth / 2 / innerWidth) * 2 - 1,
      crosshairY: -(innerHeight / 2 / innerHeight) * 2 + 1,
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
    event.preventDefault()
    input.keysMap[`Mouse${event.button}`] = true

    setAction(`Mouse${event.button}`)
    setPointerLock()
    // case 0: // left mouse button
    // case 1: // cursor wheel button
    // case 2: // right mouse button
    // case 3: // navigate forward
    // case 4: // navigate back
  }
  const onMouseUp = (event: MouseEvent) => {
    event.preventDefault()
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
    input.mouse.crosshairX = (event.clientX / innerWidth) * 2 - 1
    input.mouse.crosshairY = -(event.clientY / innerHeight) * 2 + 1

    input.mouse.mouseXDelta = event.movementX || 0 // Updated to use movementX
    input.mouse.mouseYDelta = event.movementY || 0 // Updated to use movementY
  }

  const update = () => {
    // Process mouse deltas for camera movement here
    input.mouse.mouseX = LOOK_AROUND_SPEED * input.mouse.mouseXDelta
    input.mouse.mouseY = input.mouse.mouseYDelta

    // Reset deltas after processing
    input.mouse.mouseXDelta = 0 // Resetting X delta
    input.mouse.mouseYDelta = 0 // Resetting Y delta
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
  // document.addEventListener('pointermove', e => onMouseMove(e), false)
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === document.body) {
      // console.log('Pointer locked')
      document.addEventListener('mousemove', onMouseMove, false)
    } else {
      // console.log('Pointer unlocked')
      document.removeEventListener('mousemove', onMouseMove, false)
    }
  })

  function setPointerLock() {
    document.body.requestPointerLock({
      unadjustedMovement: Options.unadjustedMovement,
    })
  }
  function isPointerLocked() {
    return document.pointerLockElement
  }
  function togglePointerLock() {
    document.pointerLockElement === document.body ? removePointerLock() : setPointerLock()
  }
  function removePointerLock() {
    if (document.pointerLockElement) {
      document.exitPointerLock()
      console.log('%c Pointer lock released.', 'color: grey')
    } else {
      console.log('%c Pointer is not locked.', 'color: grey')
    }
  }

  state.input = input
  state.controls = input.actionsMap
  state.controls.mouse = input.mouse
  state.controls.keysMap = input.keysMap
  state.controls.isPointerLocked = isPointerLocked
  state.controls.removePointerLock = removePointerLock
  state.controls.setPointerLock = setPointerLock
  state.controls.togglePointerLock = togglePointerLock

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
