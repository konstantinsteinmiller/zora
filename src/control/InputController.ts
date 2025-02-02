import * as THREE from 'three'
import { createRayTrace } from '@/utils/function'
import { createTwinShotVFX } from '@/utils/vfx.ts'

export default class InputController {
  keysMap: { [key: string]: boolean | number } = {}
  current = { mouseX: 0, mouseY: 0, mouseXDelta: 0, mouseYDelta: 0 }
  previous: any = null
  target = null
  lookAroundSpeed = 1.5

  constructor() {
    this.init()
  }

  init() {
    this.keysMap = {
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
    }
    this.current = {
      mouseX: 0,
      mouseY: 0,
      mouseXDelta: 0,
      mouseYDelta: 0,
      crosshairX: (innerWidth / 2 / innerWidth) * 2 - 1,
      crosshairY: -(innerHeight / 2 / innerHeight) * 2 + 1,
    }
    this.previous = null

    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2(this.current.crosshairX, this.current.crosshairY)

    document.addEventListener('keydown', e => this.onKeyDown(e), false)
    document.addEventListener('keyup', e => this.onKeyUp(e), false)
    document.addEventListener('mousedown', e => this.onMouseDown(e), false)
    document.addEventListener('mouseup', e => this.onMouseUp(e), false)
    document.addEventListener('pointermove', e => this.onMouseMove(e), false)
  }

  fireRaycaster() {
    this.raycaster.setFromCamera(this.pointer, window.camera)
    const intersects = this.raycaster.intersectObjects(window.scene.children, true)

    if (intersects.length === 0) {
      return
    }

    const intersect = intersects.find(inter => {
      return inter.object.type !== 'AxesHelper'
    })
    // const object = intersect.object
    // console.log('intersect object:', object.name, intersect, intersect.point)
    createRayTrace(player.getPosition, intersect.point, intersect.distance)
    createTwinShotVFX(intersect.point)
  }

  onMouseDown(event: MouseEvent) {
    switch (event.button) {
      case 0: // left mouse button
        this.keysMap.leftMouse = true
        this.fireRaycaster()
        break
      case 1: // cursor wheel button
        this.keysMap.middleMouse = true
        break
      case 2: // right mouse button
        this.keysMap.rightMouse = true
        break
    }
  }

  onMouseUp(event: MouseEvent) {
    switch (event.button) {
      case 0: // left mouse button
        this.keysMap.leftMouse = false
        break
      case 1: // cursor wheel button
        this.keysMap.middleMouse = false
        break
      case 2: // right mouse button
        this.keysMap.rightMouse = false
        break
    }
  }

  onKeyDown(event: KeyboardEvent) {
    // console.log('event.keyCode: ', event.keyCode)
    switch (event.keyCode) {
      case 87: // w
        this.keysMap.forward = true
        break
      case 65: // a
        this.keysMap.left = true
        break
      case 83: // s
        this.keysMap.backward = true
        break
      case 68: // d
        this.keysMap.right = true
        break
      case 70: // f
        this.keysMap.interact = true
        break
      case 71: // g
        this.keysMap.lookBack = true
        this.keysMap.firstPersonCamera = true
        window.isLookBack = this.keysMap.lookBack
        window.isThirdPerson = !this.keysMap.firstPersonCamera
        window.showCrosshair = !window.isLookBack
        const $game = document.querySelector('.game')
        $game.classList.remove('cursor--hidden')
        // if ($game.classList.contains('cursor--hidden')) {
        //   $game.classList.remove('cursor--hidden')
        // }
        break
      case 72: // h
        this.keysMap.firstPersonCamera = !this.keysMap.firstPersonCamera
        this.keysMap.lookBack = false
        window.isThirdPerson = !this.keysMap.firstPersonCamera
        window.showCrosshair = true
        window.isLookBack = false
        break
      case 69: // e
        this.keysMap.dunno = true
        break
      case 73: // i
        this.keysMap.inventory = !this.keysMap.inventory
        break
      case 9: // TAB
        this.keysMap.inventory = !this.keysMap.inventory
        break
      case 32: // SPACE
        this.keysMap.space = true
        break
      case 16: // SHIFT
        this.keysMap.shift = true
        break
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 87: // w
        this.keysMap.forward = false
        break
      case 65: // a
        this.keysMap.left = false
        break
      case 83: // s
        this.keysMap.backward = false
        break
      case 68: // d
        this.keysMap.right = false
        break
      case 70: // f
        this.keysMap.interact = false
        break
      case 69: // e
        this.keysMap.dunno = false
        break
      case 71: // g
        this.keysMap.lookBack = false
        window.isLookBack = this.keysMap.lookBack
        window.showCrosshair = !window.isLookBack
        this.keysMap.firstPersonCamera = true
        window.isThirdPerson = !this.keysMap.firstPersonCamera

        const $game = document.querySelector('.game')
        $game.classList.add('cursor--hidden')
        break
      case 32: // SPACE
        this.keysMap.space = false
        break
      case 16: // SHIFT
        this.keysMap.shift = false
        break
    }
  }

  onMouseMove(event: MouseEvent) {
    this.current.mouseX = event.pageX - innerWidth / 2
    this.current.mouseY = event.pageY - innerHeight / 2
    this.current.crosshairX = (event.clientX / innerWidth) * 2 - 1
    this.current.crosshairY = -(event.clientY / innerHeight) * 2 + 1

    if (this.previous === null) {
      this.previous = {
        ...this.current,
      }
    }
    this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX
    this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY
  }

  isReady() {
    return this.previous !== null
  }

  update(_: any) {
    if (this.previous !== null) {
      this.current.mouseXDelta = this.current.mouseX - this.previous.mouseX
      this.current.mouseYDelta = this.current.mouseY - this.previous.mouseY
      if (this.current.mouseX === -innerWidth / 2) {
        this.current.mouseXDelta = -this.lookAroundSpeed
      }
      if (this.current.mouseX >= innerWidth / 2 - 1) {
        this.current.mouseXDelta = this.lookAroundSpeed
      }

      this.previous = { ...this.current }
    }
  }
}
