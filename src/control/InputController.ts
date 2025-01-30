export default class InputController {
  keysMap: { [key: string]: boolean | number } = {}
  current = { mouseX: 0, mouseY: 0, mouseXDelta: 0, mouseYDelta: 0 }
  previous: any = null
  target = null

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
    }
    this.current = {
      mouseX: 0,
      mouseY: 0,
      mouseXDelta: 0,
      mouseYDelta: 0,
    }
    this.previous = null
    document.addEventListener('keydown', e => this.onKeyDown(e), false)
    document.addEventListener('keyup', e => this.onKeyUp(e), false)
    document.addEventListener('mousedown', e => this.onMouseDown(e), false)
    document.addEventListener('mouseup', e => this.onMouseUp(e), false)
    document.addEventListener('mousemove', e => this.onMouseMove(e), false)
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

      this.previous = { ...this.current }
    }
  }
}
