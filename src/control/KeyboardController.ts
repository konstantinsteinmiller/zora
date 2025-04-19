import ControlActions, { getPrefilledActionsMap } from '@/control/ControlActions.ts'
import { useKeyboard } from '@/use/useKeyboard.ts'
import { LOOK_AROUND_SPEED, Options } from '@/utils/constants.ts'
import $ from '@/global'
import type { Enum, EnumStringToList } from '@/types/general.ts'
import { onUnlockedMouseMove } from '@/utils/find-pointer.ts'
import Confetti from 'canvas-confetti'
import { Vector3 } from 'three'

export let input: any = {}

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
  rotateLeft: ['KeyK'],
  rotateRight: ['KeyL'],
  jump: ['Mouse2'],
  hit: ['ControlLeft', 'KeyH'],
  hurt: ['ControlLeft', 'KeyH'],
  fly: ['Mouse2'],
  talk: ['KeyF'],
  sprint: ['ShiftLeft'],
  pause: ['KeyP'],
  lookBack: ['KeyG'],
  toggleCamera: ['KeyH'],
  moveToTargetPosition: ['ControlLeft', 'KeyV'],
  toggleDebug: ['ControlLeft', 'KeyC'],
  esc: ['Escape'],
}
let controlsConfig = JSON.parse(JSON.stringify(defaultControlsConfig))

export default (entity?: any) => {
  if (input?.mouse) return input // singleton makes problems when switching to arena, it keeps using the world player ref in entity
  const { activatedKeysMap } = useKeyboard()

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
      if (list.includes(code) && entity) {
        /* set previous action to current action state, then update the current action state */
        input.actionsMap.previous[action] = input.actionsMap[action]
        input.actionsMap[action] = list.every((key: string) => input.keysMap[key])

        const hasChanged = input.actionsMap[action] !== input.actionsMap.previous[action]

        input.actionsMap[action] /*
         */
          ? input.actions[action]?.onActivate?.(entity, hasChanged)
          : input.actions[action]?.onDeactivate?.(entity)
      }
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if ($.isMenu.value) return

    event.preventDefault()
    input.keysMap[`Mouse${event.button}`] = true
    activatedKeysMap.value[`Mouse${event.button}`] = true

    if (!entity) return

    setAction(`Mouse${event.button}`)
    setTimeout(() => {
      !$.isMenu.value && !document.pointerLockElement && setPointerLock()
    })
    // case 0: // left mouse button
    // case 1: // cursor wheel button
    // case 2: // right mouse button
    // case 3: // navigate forward
    // case 4: // navigate back
  }
  const onMouseUp = (event: MouseEvent) => {
    // if ($.isMenu.value) return

    event.preventDefault()
    input.keysMap[`Mouse${event.button}`] = false
    setAction(`Mouse${event.button}`)
  }

  const preventedKeyDownEventsList = ['Space']
  const preventedControlCommandsList = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyH']
  const onKeyDown = (event: KeyboardEvent) => {
    if ($.isMenu.value) return

    // $.enableDebug && console.log('event.code: ', event.code, event.keyCode)
    if (preventedKeyDownEventsList.includes(event.code)) event.preventDefault()
    if (event.ctrlKey && preventedControlCommandsList.includes(event.code)) event.preventDefault()

    input.keysMap[event.code] = true
    activatedKeysMap.value[event.code] = true
    setAction(event.code)
  }

  const onKeyUp = (event: KeyboardEvent) => {
    // if ($.isMenu.value) return

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

  $.addEvent(
    'renderer.update',
    () => {
      update()
    },
    () => {},
    'input'
  )

  const onContextMenu = (e: any) => e.preventDefault()

  const onPointerLockChange = () => {
    if (document.pointerLockElement === document.body) {
      // console.log('Pointer locked')

      if ($.controls.attack) {
        $.triggerEvent('controls.attack1.down')
      }

      if (!document.pointerLockElement) return // Prevents double firing

      toggleCursor(true)
      document.removeEventListener('mousemove', onUnlockedMouseMove, false)
      document.addEventListener('mousemove', onMouseMove, false)
    } else {
      // console.log('Pointer unlocked')

      if ($.controls.attack) {
        $.triggerEvent('controls.attack1.up')
      }
      if (document.pointerLockElement) return // Prevents double firing

      toggleCursor(false)
      document.removeEventListener('mousemove', onMouseMove, false)
      document.addEventListener('mousemove', onUnlockedMouseMove, false)
    }
  }

  document.addEventListener('click', onClick, false)
  document.addEventListener('keydown', onKeyDown, false)
  document.addEventListener('keyup', onKeyUp, false)
  document.addEventListener('contextmenu', onContextMenu, false)
  document.addEventListener('mousedown', onMouseDown, false)
  document.addEventListener('mouseup', onMouseUp, false)
  document.addEventListener('mousemove', onUnlockedMouseMove, false)
  document.addEventListener('pointerlockchange', onPointerLockChange)

  $.addEvent('battle.cleanup', () => {
    document.removeEventListener('keydown', onKeyDown, false)
    document.removeEventListener('keyup', onKeyUp, false)
    document.removeEventListener('contextmenu', onContextMenu, false)
    document.removeEventListener('mousedown', onMouseDown, false)
    document.removeEventListener('mouseup', onMouseUp, false)
    document.removeEventListener('mousemove', onUnlockedMouseMove, false)
    document.removeEventListener('mousemove', onMouseMove, false)
  })

  $.addEvent('level.cleanup', () => {
    document.removeEventListener('click', onClick, false)
    document.removeEventListener('pointerlockchange', onPointerLockChange)

    document.removeEventListener('keydown', onKeyDown, false)
    document.removeEventListener('keyup', onKeyUp, false)
    document.removeEventListener('contextmenu', onContextMenu, false)
    document.removeEventListener('mousedown', onMouseDown, false)
    document.removeEventListener('mouseup', onMouseUp, false)
    document.removeEventListener('mousemove', onUnlockedMouseMove, false)
    document.removeEventListener('mousemove', onMouseMove, false)
  })

  function onClick(event: MouseEvent) {
    if (isCursorVisible() && $.isBattleOver) {
      spraySprincles(event)
    }
  }
  function setPointerLock() {
    if ($.isBattleOver) return

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

      if (document.pointerLockElement) {
        // If for some reason pointer lock wasn't released, simulate the Escape keydown event
        const escapeEvent = new KeyboardEvent('keydown', {
          key: 'Escape',
          keyCode: 27,
          code: 'Escape',
          which: 27,
          bubbles: true,
        })

        // Dispatch the Escape event on the document to force release
        document.dispatchEvent(escapeEvent)

        // Optionally log this for debugging purposes
        console.log('%c Pointer lock released or Escape triggered.', 'color: grey')
      }

      // console.log('%c Pointer lock released.', 'color: grey')
    } else {
      // console.log('%c Pointer is not locked.', 'color: grey')
    }
  }

  function toggleCursor(hideCursorOverwrite: boolean) {
    const classList: any = document.querySelector('.cursor')?.classList
    if (hideCursorOverwrite === undefined) {
      classList?.toggle('hidden')
    } else if (!hideCursorOverwrite) {
      classList?.remove('hidden')
    } else if (hideCursorOverwrite) {
      classList?.add('hidden')
    }
  }

  function isCursorVisible() {
    return !document.querySelector('.cursor')?.classList?.contains('cursor--hidden')
  }

  $.input = input
  $.controls = input.actionsMap
  $.controls.mouse = input.mouse
  $.controls.keysMap = input.keysMap
  $.controls.isPointerLocked = isPointerLocked
  $.controls.removePointerLock = removePointerLock
  $.controls.setPointerLock = setPointerLock
  $.controls.togglePointerLock = togglePointerLock
  $.controls.toggleCursor = toggleCursor
  $.controls.onUnlockedMouseMove = onUnlockedMouseMove

  $.addEvent('level.cleanup', () => {
    input = null
    $.controls = null
    console.log('level.cleanup: ', input)
  })

  return input
}

export function spraySprincles(event: MouseEvent) {
  const { clientX, clientY } = event
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

import { startFairySprinklesVFX } from '@/vfx/spricles-vfx.ts'

let sprinclesCount = 0
export function spraySprinclesAtWorldPosition(entity: any) {
  if (entity.guild !== 'guild-companion-fairy' || !entity.id.includes('nature_fairy')) return
  sprinclesCount++
  if (sprinclesCount % 10 !== 0) return

  const worldPosition = new Vector3(
    entity.mesh.position.x,
    entity.mesh.position.y - entity.halfHeight * 1.5,
    entity.mesh.position.z
  )
  startFairySprinklesVFX(worldPosition)

  // Project the world position to screen space
  // worldPosition.project($.camera)

  // Convert the normalized screen coordinates (-1 to 1) to pixel coordinates
  // const screenX = ((worldPosition.x + 1) / 2) * innerWidth
  // const screenY = ((1 - worldPosition.y) / 2) * innerHeight
  // console.log(entity.id, ': ', screenX, screenY)

  // Confetti({
  //   particleCount: 25,
  //   shapes: ['star'],
  //   angle: 155,
  //   startVelocity: 3.5,
  //   gravity: 0.2,
  //   scalar: 0.25,
  //   drift: 0.15,
  //   decay: 0.9,
  //   zIndex: 199,
  //   colors: ['#f3eaea', '#fddc5c', '#ffc627', '#cca994', '#fcd975', '#ffdf00'],
  //   spread: 70,
  //   origin: { x: screenX, y: screenY },
  // })
}

export const KeyboardKeysMap = {
  Mouse0: 'LMB',
  Mouse1: 'Mouse1',
  Mouse2: 'RMB',
  IntlBackslash: 'IntlBackslash',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  Digit0: '0',
  Minus: 'Minus',
  Equal: 'Equal',
  Backspace: 'Backspace',
  Tab: 'Tab',
  KeyQ: 'Q',
  KeyW: 'W',
  KeyE: 'E',
  KeyR: 'R',
  KeyT: 'T',
  KeyY: 'Y',
  KeyU: 'U',
  KeyI: 'I',
  KeyO: 'O',
  KeyP: 'P',
  BracketLeft: 'BracketLeft',
  BracketRight: 'BracketRight',
  Enter: 'Enter',
  CapsLock: 'CapsLock',
  KeyA: 'A',
  KeyS: 'S',
  KeyD: 'D',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  Semicolon: 'Semicolon',
  Quote: 'Quote',
  Backslash: 'Backslash',
  ShiftLeft: 'ShiftLeft',
  Backquote: 'Backquote',
  KeyZ: 'Z',
  KeyX: 'X',
  KeyC: 'C',
  KeyV: 'V',
  KeyB: 'B',
  KeyN: 'N',
  KeyM: 'M',
  Comma: 'Comma',
  Period: 'Period',
  Slash: 'Slash',
  ShiftRight: 'SHIFT Left',
  ControlLeft: 'CTRL',
  AltLeft: 'Alt_L',
  MetaLeft: 'MetaLeft',
  MetaRight: 'MetaRight',
  AltRight: 'Alt_R',
  ControlRight: 'CTRL_R',
  Space: 'Space',
  Numpad1: 'Numpad1',
  Numpad2: 'Numpad2',
  Numpad3: 'Numpad3',
  Numpad4: 'Numpad4',
  Numpad5: 'Numpad5',
  Numpad6: 'Numpad6',
  Numpad7: 'Numpad7',
  Numpad8: 'Numpad8',
  Numpad9: 'Numpad9',
  NumLock: 'NumLock',
  NumpadEqual: 'NumpadEqual',
  NumpadDivide: 'NumpadDivide',
  NumpadMultiply: 'NumpadMultiply',
  NumpadSubtract: 'NumpadSubtract',
  NumpadAdd: 'NumpadAdd',
  NumpadEnter: 'NumpadEnter',
  Numpad0: 'Numpad0',
  NumpadDecimal: 'NumpadDecimal',
  Delete: 'Delete',
  End: 'End',
  Home: 'Home',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Escape: 'Escape',
  PrintScreen: 'PrintScreen',
  ScrollLock: 'ScrollLock',
  Pause: 'Pause',
  Insert: 'Insert',
}
