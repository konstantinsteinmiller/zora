import * as THREE from 'three'
import { createRayTrace } from '@/utils/function'
import { createTwinShotVFX } from '@/utils/vfx.ts'
import state from '@/states/GlobalState'

let input: {
  keysMap: { [key: string]: boolean | number }
  current: { [key: string]: number }
  previous: { [key: string]: number }
} = {}

export default () => {
  if (input.current) {
    return input
  }

  input = {
    keysMap: {
      interact: false,
      dunno: false,
      inventory: false,
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
      leftMouse: false,
      middleMouse: false,
      rightMouse: false,
      lookBack: false,
      firstPersonCamera: false,
      pause: false,
    },
    current: {
      mouseX: 0,
      mouseY: 0,
      mouseXDelta: 0,
      mouseYDelta: 0,
      crosshairX: (innerWidth / 2 / innerWidth) * 2 - 1,
      crosshairY: -(innerHeight / 2 / innerHeight) * 2 + 1,
    },
    previous: null,
  }

  const lookAroundSpeed = 1.5

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2(input.current.crosshairX, input.current.crosshairY)

  const fireRaycaster = () => {
    raycaster.setFromCamera(pointer, state.camera)
    const intersects = raycaster.intersectObjects(state.scene.children, true)

    if (intersects.length === 0) {
      return
    }

    const intersect = intersects.find(inter => {
      return inter.object.type !== 'AxesHelper'
    })
    // const object = intersect.object
    // console.log('intersect object:', object.name, intersect, intersect?.point)
    if (intersect?.point) {
      createRayTrace(state.player.getPosition(), intersect.point, intersect.distance)
      createTwinShotVFX(intersect.point)
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    switch (event.button) {
      case 0: // left mouse button
        input.keysMap.leftMouse = true
        fireRaycaster()
        break
      case 1: // cursor wheel button
        input.keysMap.middleMouse = true
        break
      case 2: // right mouse button
        input.keysMap.rightMouse = true
        break
    }
  }

  const onMouseUp = (event: MouseEvent) => {
    switch (event.button) {
      case 0: // left mouse button
        input.keysMap.leftMouse = false
        break
      case 1: // cursor wheel button
        input.keysMap.middleMouse = false
        break
      case 2: // right mouse button
        input.keysMap.rightMouse = false
        break
    }
  }

  const onKeyDown = (event: KeyboardEvent) => {
    console.log('event.keyCode: ', event.keyCode)
    switch (event.keyCode) {
      case 87: // w
        input.keysMap.forward = true
        break
      case 65: // a
        input.keysMap.left = true
        break
      case 83: // s
        input.keysMap.backward = true
        break
      case 68: // d
        input.keysMap.right = true
        break
      case 70: // f
        input.keysMap.interact = true
        break
      case 71: // g
        input.keysMap.lookBack = true
        input.keysMap.firstPersonCamera = true
        state.isLookBack = input.keysMap.lookBack
        state.isThirdPerson = !input.keysMap.firstPersonCamera
        state.showCrosshair = !state.isLookBack
        const $game = document.querySelector('.game')
        $game.classList.remove('cursor--hidden')
        // if ($game.classList.contains('cursor--hidden')) {
        //   $game.classList.remove('cursor--hidden')
        // }
        break
      case 72: // h
        input.keysMap.firstPersonCamera = !input.keysMap.firstPersonCamera
        input.keysMap.lookBack = false
        state.isThirdPerson = !input.keysMap.firstPersonCamera
        state.showCrosshair = true
        state.isLookBack = false
        break
      case 69: // e
        input.keysMap.dunno = true
        break
      case 80: // p
        input.keysMap.pause = !input.keysMap.pause
        state.isPaused = input.keysMap.pause
        break
      case 73: // i
        input.keysMap.inventory = !input.keysMap.inventory
        break
      case 9: // TAB
        input.keysMap.inventory = !input.keysMap.inventory
        break
      case 32: // SPACE
        input.keysMap.space = true
        break
      case 16: // SHIFT
        input.keysMap.shift = true
        break
    }
  }

  const onKeyUp = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 87: // w
        input.keysMap.forward = false
        break
      case 65: // a
        input.keysMap.left = false
        break
      case 83: // s
        input.keysMap.backward = false
        break
      case 68: // d
        input.keysMap.right = false
        break
      case 70: // f
        input.keysMap.interact = false
        break
      case 69: // e
        input.keysMap.dunno = false
        break
      case 71: // g
        input.keysMap.lookBack = false
        state.isLookBack = input.keysMap.lookBack
        state.showCrosshair = !state.isLookBack
        input.keysMap.firstPersonCamera = true
        state.isThirdPerson = !input.keysMap.firstPersonCamera

        const $game = document.querySelector('.game')
        $game.classList.add('cursor--hidden')
        break
      case 32: // SPACE
        input.keysMap.space = false
        break
      case 16: // SHIFT
        input.keysMap.shift = false
        break
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    input.current.mouseX = event.pageX - innerWidth / 2
    input.current.mouseY = event.pageY - innerHeight / 2
    input.current.crosshairX = (event.clientX / innerWidth) * 2 - 1
    input.current.crosshairY = -(event.clientY / innerHeight) * 2 + 1

    if (input.previous === null) {
      input.previous = {
        ...input.current,
      }
    }
    input.current.mouseXDelta = input.current.mouseX - input.previous.mouseX
    input.current.mouseYDelta = input.current.mouseY - input.previous.mouseY
  }

  const isReady = () => {
    return input.previous !== null
  }

  const update = () => {
    if (input.previous !== null) {
      input.current.mouseXDelta = input.current.mouseX - input.previous.mouseX
      input.current.mouseYDelta = input.current.mouseY - input.previous.mouseY
      if (input.current.mouseX === -innerWidth / 2) {
        input.current.mouseXDelta = -lookAroundSpeed
      }
      if (input.current.mouseX >= innerWidth / 2 - 1) {
        input.current.mouseXDelta = lookAroundSpeed
      }

      input.previous = { ...input.current }
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
  document.addEventListener('mousedown', e => onMouseDown(e), false)
  document.addEventListener('mouseup', e => onMouseUp(e), false)
  document.addEventListener('pointermove', e => onMouseMove(e), false)

  state.input = input
  return input
}
