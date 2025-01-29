export default class InputController {
  keysMap: { [key: string]: boolean } = {}

  constructor() {
    this.init()
  }

  init() {
    this.keysMap = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
      leftMouse: false,
      middleMouse: false,
      rightMouse: false,
    }
    document.addEventListener('keydown', e => this.onKeyDown(e), false)
    document.addEventListener('keyup', e => this.onKeyUp(e), false)
    document.addEventListener('mousedown', e => this.onMouseDown(e), false)
    document.addEventListener('mouseup', e => this.onMouseUp(e), false)
  }

  onMouseDown(event: MouseEvent) {
    switch (event.button) {
      case 0: // left mouse button
        this.keysMap.leftMouse = true
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
      case 32: // SPACE
        this.keysMap.space = false
        break
      case 16: // SHIFT
        this.keysMap.shift = false
        break
    }
  }
}
