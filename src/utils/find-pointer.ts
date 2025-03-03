import { Vector2 } from 'three'
import { lerp } from 'three/src/math/MathUtils'

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

const isCursorOnScreen = (clientX: number, clientY: number) => {
  let hoveredElement = document.querySelectorAll(':hover')
  hoveredElement = hoveredElement[hoveredElement.length - 1] // Get the most specific hovered element

  const classList = document.querySelector('.cursor')?.classList

  if (hoveredElement === undefined) {
    classList?.add('cursor--hidden')
  } else {
    classList?.remove('cursor--hidden')
  }
}

export const onUnlockedMouseMove = (event: any) => {
  const { clientX, clientY } = event
  const cursorNode: any = document.querySelector('.cursor')
  if (!cursorNode) return

  setTimeout(() => {
    isCursorOnScreen()
  }, 100)

  setCursorPosition(clientX, clientY, cursorNode)
}
