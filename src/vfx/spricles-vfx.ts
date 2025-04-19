import $ from '@/global'
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, Points, PointsMaterial, Vector3 } from 'three'

const sprinkleColors = [0xf3eaea, 0xfddc5c, 0xffc627, 0xcca994, 0xfcd975, 0xffdf00]
const sprinkleCount = 3 // Increased particle count for better density
const sprinkleSpeedY = 0.02 // Initial downward speed
const sprinkleSpeedXZ = 0.005
const sprinkleGravity = 0.01 // Positive gravity to pull downwards
const sprinkleFadeOutTime = 1500 // milliseconds
const sprinkleLifeTime = 2000 // milliseconds
const particleBaseSize = 2 // Base size for the PointsMaterial
const particleSizeVariance = 1 // Variance in base size

export const startFairySprinklesVFX = (position: Vector3) => {
  const particlesGeometry = new BufferGeometry()
  const positions = new Float32BufferAttribute(sprinkleCount * 3, 3)
  const colors = new Float32BufferAttribute(sprinkleCount * 3, 3)
  const sizes = new Float32BufferAttribute(sprinkleCount, 1) // Use 'size' attribute
  const alphas = new Float32BufferAttribute(sprinkleCount, 1)

  const initialParticleData: {
    position: Vector3
    velocity: Vector3
    color: Color
    startTime: number
    initialSize: number // Store initial size
  }[] = []

  for (let i = 0; i < sprinkleCount; i++) {
    const pos = new Vector3(
      -0.075 + (Math.random() - 0.05) * 0.15, // Even tighter initial spread
      0.13,
      (Math.random() - 0.05) * 0.15
    )
    positions.setXYZ(i, pos.x, pos.y, pos.z)

    const color = new Color(sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)])
    colors.setXYZ(i, color.r, color.g, color.b)

    const initialSize = particleBaseSize + Math.random() * particleSizeVariance
    sizes.setX(i, initialSize) // Set the size attribute
    alphas.setX(i, 1)

    const velocity = new Vector3(
      (Math.random() - 0.5) * sprinkleSpeedXZ * 0.5,
      -sprinkleSpeedY * 0.5 - Math.random() * sprinkleSpeedY * 0.5, // Negative Y for downward spray
      (Math.random() - 0.5) * sprinkleSpeedXZ * 0.5
    )

    initialParticleData.push({
      position: new Vector3().copy(pos),
      velocity,
      color,
      startTime: Date.now(),
      initialSize, // Store initial size
    })
  }

  particlesGeometry.setAttribute('position', positions)
  particlesGeometry.setAttribute('color', colors)
  particlesGeometry.setAttribute('size', sizes) // Set the size attribute
  particlesGeometry.setAttribute('alpha', alphas)

  const material = new PointsMaterial({
    size: 0.025, // Base size
    vertexColors: true,
    transparent: true,
    blending: AdditiveBlending,
    opacity: 1,
    sizeAttenuation: true, // Particles get smaller with distance
  })

  const particles = new Points(particlesGeometry, material)
  particles.position.copy(position)
  particles.name = 'vfx-fairy-sprinkles'
  $.scene.add(particles)

  const eventUuid = $.addEvent('renderer.update', () => {
    const now = Date.now()
    const positionsArray = particlesGeometry.attributes.position.array as number[]
    const sizesArray = particlesGeometry.attributes.size.array as number[] // Get the size attribute
    const alphasArray = particlesGeometry.attributes.alpha.array as number[]

    for (let i = 0; i < sprinkleCount; i++) {
      const data = initialParticleData[i]
      const timeElapsed = now - data.startTime
      const normalizedTime = timeElapsed / sprinkleLifeTime

      if (timeElapsed > sprinkleLifeTime) {
        data.startTime = now
        data.position.set((Math.random() - 0.05) * 0.05, 0, (Math.random() - 0.05) * 0.05)
        data.velocity.set(
          (Math.random() - 0.5) * sprinkleSpeedXZ * 0.5,
          -sprinkleSpeedY * 0.5 - Math.random() * sprinkleSpeedY * 0.5, // Initial downward
          (Math.random() - 0.5) * sprinkleSpeedXZ * 0.5
        )
        data.initialSize = particleBaseSize + Math.random() * particleSizeVariance // Reset initial size
        sizesArray[i] = data.initialSize
      }

      data.velocity.y -= sprinkleGravity * 0.016 // Apply positive gravity downwards

      data.position.add(data.velocity.clone().multiplyScalar(0.016 * 60))

      positionsArray[i * 3 + 0] = data.position.x
      positionsArray[i * 3 + 1] = data.position.y
      positionsArray[i * 3 + 2] = data.position.z

      // Scale down the size attribute
      sizesArray[i] = data.initialSize * Math.max(0, 1 - normalizedTime * 1.5) // Adjust scaling factor

      let alpha = 1
      if (timeElapsed > sprinkleLifeTime - sprinkleFadeOutTime) {
        alpha = 1 - (timeElapsed - (sprinkleLifeTime - sprinkleFadeOutTime)) / sprinkleFadeOutTime
      }
      alphasArray[i] = Math.max(0, alpha)
    }

    particlesGeometry.attributes.position.needsUpdate = true
    particlesGeometry.attributes.size.needsUpdate = true // Update the size attribute
    particlesGeometry.attributes.alpha.needsUpdate = true
  })

  const cleanup = () => {
    $.removeEvent('renderer.update', eventUuid)
    particlesGeometry.dispose()
    material.dispose()
    $.scene.remove(particles)
  }
  $.addEvent('level.cleanup', cleanup)

  setTimeout(cleanup, sprinkleLifeTime + sprinkleFadeOutTime)

  return { vfx: { emit: () => {} }, vfxObject: particles } // Simple emit for consistency
}
