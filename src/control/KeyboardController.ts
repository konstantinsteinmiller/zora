import ControlActions, { getPrefilledActionsMap } from '@/control/ControlActions.ts'
import { LOOK_AROUND_SPEED, Options } from '@/enums/constants.ts'
import state from '@/states/GlobalState'
import type { ActionFunctionMap } from '@/types/controller-types.ts'
import type { BoolEnum, Enum, EnumStringToList } from '@/types/general.ts'
import { onUnlockedMouseMove } from '@/utils/find-pointer.ts'
import Confetti from 'canvas-confetti'

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
  hit: ['ControlLeft', 'KeyH'],
  hurt: ['ControlLeft', 'KeyH'],
  fly: ['Mouse2'],
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
    setTimeout(() => {
      setPointerLock()
    })
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
  const preventedControlCommandsList = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyH']
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

  document.addEventListener('click', e => onClick(e), false)
  document.addEventListener('keydown', e => onKeyDown(e), false)
  document.addEventListener('keyup', e => onKeyUp(e), false)
  document.addEventListener('contextmenu', e => e.preventDefault(), false)
  document.addEventListener('mousedown', e => onMouseDown(e), false)
  document.addEventListener('mouseup', e => onMouseUp(e), false)
  // document.addEventListener('pointermove', e => onMouseMove(e), false)
  document.addEventListener('mousemove', onUnlockedMouseMove, false)
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === document.body) {
      // console.log('Pointer locked')
      toggleCursor(true)
      document.removeEventListener('mousemove', onUnlockedMouseMove, false)
      document.addEventListener('mousemove', onMouseMove, false)
    } else {
      // console.log('Pointer unlocked')
      toggleCursor(false)
      document.removeEventListener('mousemove', onMouseMove, false)
      document.addEventListener('mousemove', onUnlockedMouseMove, false)
    }
  })

  function onClick(event: MouseEvent) {
    if (isCursorVisible() && state.isBattleOver) {
      const { clientX, clientY } = event
      // const star = Confetti.shapeFromPath({
      //   path: 'M 47.755 3.765 l 11.525 23.353 c 0.448 0.907 1.313 1.535 2.314 1.681 l 25.772 3.745 c 2.52 0.366 3.527 3.463 1.703 5.241 L 70.42 55.962 c -0.724 0.706 -1.055 1.723 -0.884 2.72 l 4.402 25.667 c 0.431 2.51 -2.204 4.424 -4.458 3.239 L 46.43 75.47 c -0.895 -0.471 -1.965 -0.471 -2.86 0 L 20.519 87.588 c -2.254 1.185 -4.889 -0.729 -4.458 -3.239 l 4.402 -25.667 c 0.171 -0.997 -0.16 -2.014 -0.884 -2.72 L 0.931 37.784 c -1.824 -1.778 -0.817 -4.875 1.703 -5.241 l 25.772 -3.745 c 1.001 -0.145 1.866 -0.774 2.314 -1.681 L 42.245 3.765 C 43.372 1.481 46.628 1.481 47.755 3.765 z',
      // })
      Confetti({
        particleCount: 25,
        shapes: ['star'],
        angle: 155,
        startVelocity: 3.5,
        gravity: 0.2,
        scalar: 0.25,
        drift: 0.15,
        decay: 0.9,
        zIndex: 199,
        colors: ['#f3eaea', '#fddc5c', '#ffc627', '#cca994', '#fcd975', '#ffdf00' /*'#', '#'*/],
        spread: 70,
        origin: { x: clientX / innerWidth, y: clientY / innerHeight },
      })
    }
  }
  function setPointerLock() {
    if (state.isBattleOver) return
    state.isPointerLocked = true
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
      state.isPointerLocked = false
      document.exitPointerLock()
      // console.log('%c Pointer lock released.', 'color: grey')
    } else {
      // console.log('%c Pointer is not locked.', 'color: grey')
    }
  }

  function toggleCursor(hideCursorOverwrite: boolean) {
    const classList: any = document.querySelector('.cursor')?.classList
    if (hideCursorOverwrite === undefined) {
      classList?.toggle('cursor--hidden')
    } else if (!hideCursorOverwrite) {
      classList?.remove('cursor--hidden')
    } else if (hideCursorOverwrite) {
      classList?.add('cursor--hidden')
    }
  }

  function isCursorVisible() {
    return !document.querySelector('.cursor')?.classList?.contains('cursor--hidden')
  }

  state.input = input
  state.controls = input.actionsMap
  state.controls.mouse = input.mouse
  state.controls.keysMap = input.keysMap
  state.controls.isPointerLocked = isPointerLocked
  state.controls.removePointerLock = removePointerLock
  state.controls.setPointerLock = setPointerLock
  state.controls.togglePointerLock = togglePointerLock
  state.controls.toggleCursor = toggleCursor
  state.controls.onUnlockedMouseMove = onUnlockedMouseMove

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
