import AssetLoader from '@/engine/AssetLoader.ts'
import state from '@/states/GlobalState'
import { prependBaseUrl } from '@/utils/function.ts'
import { EventEmitter } from 'events'
import { AdditiveBlending, Group, NormalBlending, Sprite, SpriteMaterial, Vector3 } from 'three'

// Load the custom particle texture
let particleTexture: any
let spriteTexture: any
const loadTextures = async () => {
  const { loadTexture } = AssetLoader()
  particleTexture = await loadTexture(prependBaseUrl('/images/star/star-64x64.png'))
  spriteTexture = await loadTexture(prependBaseUrl('/images/fairy-dust/fairy-dust-100x120.png'))
}
loadTextures()

// Define three gold tones
const goldColors = [
  0xffd700, // Bright gold
  0xdaa520, // Goldenrod
  0xb8860b, // Dark goldenrod
]
const particleCount = 40 // Number of particles
const sphereRadius = 0.15 // Radius of the sphere
const shimmerSpeed = 0.025 // Speed of the shimmering effect
const lifeTime = 15000 // Lifetime of the particle system in milliseconds

export const startFairyDustVFX = (position: Vector3) => {
  // Store initial positions, offsets, and scales for particles
  const particleData: {
    initialPosition: { x: number; y: number; z: number }
    shimmerOffset: { x: number; y: number; z: number }
    initialScale: number
  }[] = []

  const particles: Sprite[] = []
  const particleGroup = new Group()
  particleGroup.name = 'vfx-fairy-dust-particles'

  const emitter: any = new EventEmitter()
  state.scene.add(particleGroup)

  // Position the particle group at the specified location
  particleGroup.position.copy(position)

  // Initialize particles on the surface of the sphere
  for (let i = 0; i < particleCount; i++) {
    // Randomly assign one of the gold colors
    const goldColor = goldColors[Math.floor(Math.random() * goldColors.length)]

    const particleMaterial = new SpriteMaterial({
      map: particleTexture,
      color: goldColor,
      transparent: true,
      opacity: 0.5,
      blending: AdditiveBlending,
      alphaTest: 0.45,
      depthWrite: true,
      premultipliedAlpha: true,
    })

    const particle = new Sprite(particleMaterial)
    const initialScale = 0.055 + Math.random() * 0.025
    particle.scale.set(initialScale, initialScale, initialScale)
    particle.raycast = () => null

    const vertex = new Vector3()
    vertex.setFromSphericalCoords(sphereRadius, Math.acos(2 * Math.random() - 1), 2 * Math.PI * Math.random())

    const initialPosition = {
      x: vertex.x,
      y: vertex.y,
      z: vertex.z,
    }

    particleData[i] = {
      initialPosition,
      shimmerOffset: { x: 0, y: 0, z: 0 },
      initialScale,
    }

    particle.position.set(initialPosition.x, initialPosition.y, initialPosition.z)
    particleGroup.add(particle)
    particles.push(particle)
  }

  let sprite: any
  function addInnerSprite() {
    const spriteMaterial = new SpriteMaterial({
      map: spriteTexture,
      blending: NormalBlending,
      color: 0xffd700,
      transparent: true,
      opacity: 0.75,
      alphaTest: 0.45,
      depthWrite: true,
    })
    sprite = new Sprite(spriteMaterial)
    sprite.name = 'vfx-fairy-dust-image'
    sprite.raycast = () => null
    sprite.scale.set(0.2, 0.2, 0.2)
    particleGroup.add(sprite)

    const cleanupSprite = () => {
      spriteMaterial.dispose()
      particleGroup.remove(sprite)
      sprite = null
      emitter.off('cleanup', cleanupSprite)
    }
    emitter.on('cleanup', cleanupSprite)
  }

  // Blinking effect variables
  const blinkStartTime = Date.now() + (lifeTime - 5000) // Start blinking 5 seconds before end
  let isBlinking = false

  const eventUuid = state.addEvent('renderer.update', () => {
    const currentTime = Date.now()

    // Check if we should start blinking
    if (currentTime >= blinkStartTime && !isBlinking) {
      isBlinking = true
    }

    // Update particles with blinking effect if active
    updateParticles(particles, isBlinking ? currentTime : undefined)
  })

  const updateParticles = (particles: Sprite[], blinkTime?: number) => {
    const playerPosition = state.player.position
    const particleSystemPosition = particleGroup.position
    const distance = playerPosition.distanceTo(particleSystemPosition)

    const minDistance = 0.5
    const maxDistance = 30
    const minScale = 1
    const maxScale = 6.0

    const clampedDistance = Math.min(Math.max(distance, minDistance), maxDistance)
    const scaleFactor =
      minScale + ((maxScale - minScale) * (clampedDistance - minDistance)) / (maxDistance - minDistance)

    // Calculate blink opacity if blinking is active
    let blinkOpacity = 1
    if (blinkTime !== undefined) {
      // Fast blink effect (every 200ms)
      const blinkPhase = ((blinkTime - blinkStartTime) % 200) / 200
      blinkOpacity = blinkPhase < 0.5 ? 0.7 : 1.2
      // Make the blinking more dramatic in the last second
      if (blinkTime > blinkStartTime + 4000) {
        blinkOpacity = blinkPhase < 0.5 ? 0 : 1 // Sharp on/off blinking
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const data = particleData[i]

      if (!particle || !data) continue

      const shimmerAmplitude = 0.02
      data.shimmerOffset.x = Math.sin(Date.now() * shimmerSpeed + i) * shimmerAmplitude
      data.shimmerOffset.y = Math.cos(Date.now() * shimmerSpeed + i) * shimmerAmplitude
      data.shimmerOffset.z = Math.sin(Date.now() * shimmerSpeed + i) * shimmerAmplitude

      particle.position.set(
        data.initialPosition.x + data.shimmerOffset.x,
        data.initialPosition.y + data.shimmerOffset.y,
        data.initialPosition.z + data.shimmerOffset.z
      )

      const currentScale = data.initialScale * scaleFactor
      particle.scale.set(currentScale, currentScale, currentScale)

      // Apply blinking effect to opacity if active
      if (blinkTime !== undefined) {
        const material = particle.material as SpriteMaterial
        material.opacity = 0.5 * blinkOpacity
        sprite.material.opacity = 0.5 * blinkOpacity
        sprite.material.needsUpdate = true
        material.needsUpdate = true
      }
    }
  }

  const cleanup = () => {
    particles.forEach(particle => {
      particleGroup.remove(particle)
      if (particle.material) {
        particle.material.dispose()
      }
    })

    particles.length = 0
    particleData.length = 0
    state.removeEvent('renderer.update', eventUuid)
    emitter.off('cleanup', cleanup)
  }
  emitter.on('cleanup', cleanup)
  state.addEvent('arena.cleanup', cleanup)

  setTimeout(() => {
    emitter.emit('cleanup')
  }, lifeTime)

  addInnerSprite()
  return { vfx: emitter, vfxObject: particleGroup }
}
