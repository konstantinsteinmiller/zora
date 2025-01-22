import { floor, angle } from '@/utils/function.ts'

const ATTACK = 0
const JUMP = 1
const LOCK = 7
const X = 0
const Z = 1

const keysPressed = {}

window.addEventListener('keydown', e => {
  keysPressed[e.key] = true
  // console.log('keysPressed: ', keysPressed)
})
window.addEventListener('keyup', e => {
  delete keysPressed[e.key]
  // console.log('keysPressed: ', keysPressed)
})

window.addEventListener('contextmenu', e => {
  e.preventDefault()
})

window.addEventListener('mousedown', e => {
  keysPressed[`button${e.button}`] = !keysPressed[`button${e.button}`]
  if (e.button === 0) {
    keysPressed[`button${e.button}`] = true
    setTimeout(() => {
      if (keysPressed[`button${e.button}`] === true) {
        keysPressed[`button${e.button}`] = false
      }
    }, 300)
  }
})

window.addEventListener('mouseup', e => {
  // keysPressed[`button${e.button}`] = !keysPressed[`button${e.button}`]
  if (e.button === 2) {
    keysPressed[`button${e.button}`] = false
  }
})

export default class Keyboard {
  get gamepad() {
    return navigator.getGamepads()[0]
  }
  get x() {
    if ((keysPressed['a'] || keysPressed['A']) && (keysPressed['d'] || keysPressed['D'])) {
      return 0
    }
    if (keysPressed['a'] || keysPressed['A']) return -1
    if (keysPressed['d'] || keysPressed['D']) return 1

    return 0
  }
  get z() {
    if ((keysPressed['w'] || keysPressed['W']) && (keysPressed['s'] || keysPressed['S'])) {
      return 0
    }
    if (keysPressed['w'] || keysPressed['W']) return -1
    if (keysPressed['s'] || keysPressed['S']) return 1

    return 0
  }
  get attack() {
    // console.log('keysPressed: ', keysPressed)
    // if (!!keysPressed[`button0`]) {
    //   const stopAttackCallback = () => {
    //     keysPressed[`button0`] = false
    //   }
    //   return stopAttackCallback
    // }
    // return false
    return !!keysPressed[`button0`]
  }
  get jump() {
    // if(!this.gamepad) return false
    return !!keysPressed[' ']
  }
  get lock() {
    // if(!this.gamepad) return false
    return !!keysPressed[`button3`]
  }
  get block() {
    // if(!this.gamepad) return false
    return !!keysPressed[`button2`]
  }
  get angle() {
    return angle(this.x, this.z)
  }

  get isMoving() {
    return Boolean(Math.abs(this.x) || Math.abs(this.z))
  }
}
