import Confetti from 'canvas-confetti'
import { Vector2 } from 'three'
import { lerp } from 'three/src/math/MathUtils.js'

export const findPointer = () => {
  return new Promise(resolve => {
    const setInitialMousePos = (event: any) => {
      const { clientX, clientY } = event
      document.body.removeEventListener('mouseover', setInitialMousePos, false)
      document.body.classList.add('cursor--hidden')
      resolve({ clientX, clientY })
    }
    document.body.addEventListener('mouseover', setInitialMousePos, false)
  })
}

export const showCustomPointer = async () => {
  const { clientX, clientY }: any = await findPointer()
  onUnlockedMouseMove({ clientX, clientY })
}

const setCursorPosition = (clientX: number, clientY: number, cursorNode: any) => {
  const [currentX] = cursorNode.style.left.split('px')
  const [currentY] = cursorNode.style.top.split('px')
  const dist = new Vector2(+currentX, +currentY).distanceTo(new Vector2(clientX, clientY))
  let interpolatedX = lerp(+currentX, clientX, 0.2)
  let interpolatedY = lerp(+currentY, clientY, 0.2)

  if (+currentX === 0 && +currentY === 0) {
    interpolatedX = clientX
    interpolatedY = clientY
  } else if (dist < 20) {
    interpolatedX = lerp(+currentX, clientX, 0.7)
    interpolatedY = lerp(+currentY, clientY, 0.7)
  } else if (dist < 10) {
    interpolatedX = clientX
    interpolatedY = clientY
  }
  cursorNode.style.left = `${interpolatedX}px`
  cursorNode.style.top = `${interpolatedY}px`
}

const isCursorOnScreen = () => {
  let hoveredElement: any = document.querySelectorAll(':hover')
  hoveredElement = hoveredElement[hoveredElement.length - 1] // Get the most specific hovered element

  const classList = document.querySelector('.cursor')?.classList

  if (hoveredElement === undefined) {
    classList?.add('cursor--hidden')
  } else {
    classList?.remove('cursor--hidden')
  }
}

let counter: number = 0
export const onUnlockedMouseMove = (event: any) => {
  const { clientX, clientY } = event
  const cursorNode: any = document.querySelector('.cursor')
  if (!cursorNode) return

  counter++
  /* sprinkles trail */
  counter % 2 === 0 &&
    Confetti({
      particleCount: 1,
      shapes: ['star'],
      angle: -90,
      startVelocity: 2.5,
      gravity: 0.35,
      scalar: 0.18,
      drift: 0.35,
      decay: 0.95,
      zIndex: 199,
      colors: ['#f3eaea', '#fddc5c', '#ffc627', '#cca994', '#fcd975', '#ffdf00' /*'#', '#'*/],
      spread: 70,
      origin: { x: (clientX + 16) / innerWidth, y: (clientY + 0) / innerHeight },
    })

  setTimeout(() => {
    isCursorOnScreen()
  }, 100)

  setCursorPosition(clientX, clientY, cursorNode)
}
