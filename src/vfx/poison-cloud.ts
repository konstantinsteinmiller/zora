import { assetManager } from '@/engine/AssetLoader.ts'
import $ from '@/global'
import useMatch from '@/use/useMatch.ts'
import { LEVELS } from '@/utils/enums.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { AdditiveBlending, Group, Sprite, SpriteMaterial } from 'three'

const particles: Sprite[] = []
let particleCount = 500 // Initial particle count
const initialParticleCount = 500 // Initial particle count
const maxParticleCount = 3000 // Maximum particle count
let startTime = Date.now() // Track the start time for the radius decrease
const totalDuration = 2 * 60 * 1000 // 2 minute in milliseconds (adjustable)

const particleGroup = new Group()
particleGroup.name = 'vfx-poison-cloud-particles'

// Ring parameters
const initialInnerRadius = 50 // Initial inner radius of the ring
const outerRadius = 100 // Outer radius of the ring (constant)
const ringHeight = 15 // Vertical height of the ring

// Store initial positions and offsets for particles
const particleData: {
  initialPosition: { x: number; y: number; z: number }
  hoverOffset: { x: number; y: number; z: number }
}[] = []

const updateParticles = (particles: Sprite[], deltaS: number) => {
  const particleTexture = assetManager.getTexture('/images/cursor-icon.png') // Get the texture from the asset manager
  const elapsedTime = Date.now() - startTime // Time elapsed since start
  const progress = Math.min(elapsedTime / totalDuration, 1) // Progress from 0 to 1

  // Calculate the current inner radius of the ring
  const currentInnerRadius = initialInnerRadius * (1 - progress) // Linearly decrease the radius

  // Calculate the current particle count
  particleCount = Math.floor(initialParticleCount + progress * (maxParticleCount - initialParticleCount)) // Grow from 500 to 3000

  // Update particle positions along the ring
  for (let i = 0; i < particleCount; i++) {
    let particle = particles[i]

    // Create new particles if needed
    if (!particle) {
      const particleMaterial = new SpriteMaterial({
        map: particleTexture, // Use the custom texture
        color: 0x00ff00, // Base color (green)
        transparent: true, // Enable transparency
        opacity: 0.8, // Overall opacity of the sprite
        blending: AdditiveBlending, // Additive blending for a glowing effect
        alphaTest: 0.5, // Discard pixels with alpha less than 0.5
      })

      particle = new Sprite(particleMaterial)

      // Randomize initial scale
      const initialScale = 1.0 // Fixed scale at 100%
      particle.scale.set(initialScale, initialScale, initialScale)

      // Disable raycasting for this sprite
      particle.raycast = () => null

      // Add particle to the scene and the particles array
      particleGroup.add(particle)
      particles.push(particle)

      // Calculate initial position near the edge of the inner radius
      const angle = Math.random() * Math.PI * 2 // Random angle around the ring
      const radius = currentInnerRadius + (outerRadius - currentInnerRadius) * Math.random() // Random radius between inner and outer radius
      const verticalOffset = (Math.random() - 0.5) * ringHeight // Random vertical position within the ring height

      const initialPosition = {
        x: radius * Math.cos(angle),
        y: verticalOffset,
        z: radius * Math.sin(angle),
      }

      // Store initial position and hover offset
      particleData[i] = {
        initialPosition,
        hoverOffset: { x: 0, y: 0, z: 0 },
      }

      // Set initial position
      particle.position.set(initialPosition.x, initialPosition.y, initialPosition.z)
    }

    // Get particle data
    const data = particleData[i]
    if (!data) continue

    // Add a small wiggle (constant, no scaling)
    const hoverSpeed = 0.05 // Slower hover speed
    data.hoverOffset.x += (Math.random() - 0.5) * deltaS * hoverSpeed // Horizontal drift (left/right)
    data.hoverOffset.z += (Math.random() - 0.5) * deltaS * hoverSpeed // Depth drift (forward/backward)

    // Float up and down using a sine wave (constant, no scaling)
    const verticalHoverAmplitude = 0.1 // Smaller amplitude for slower vertical hover
    data.hoverOffset.y = Math.sin(Date.now() * 0.005 + data.initialPosition.x) * verticalHoverAmplitude // Slower up and down motion

    // Calculate the direction vector towards the center (XZ plane)
    const centerDirection = {
      x: -particle.position.x,
      z: -particle.position.z,
    }

    // Normalize the direction vector
    const length = Math.sqrt(centerDirection.x ** 2 + centerDirection.z ** 2)
    if (length > 0) {
      centerDirection.x /= length
      centerDirection.z /= length
    }

    // Apply a slow drift towards the center
    const driftSpeed = 0.05 // Very slow drift speed
    data.hoverOffset.x += centerDirection.x * deltaS * driftSpeed
    data.hoverOffset.z += centerDirection.z * deltaS * driftSpeed

    // Update particle position relative to its initial position
    particle.position.set(
      data.initialPosition.x + data.hoverOffset.x,
      data.initialPosition.y + data.hoverOffset.y,
      data.initialPosition.z + data.hoverOffset.z
    )
  }

  // Remove excess particles if particle count decreases
  while (particles.length > particleCount) {
    const particle: any = particles.pop() // Remove the last particle
    particleGroup.remove(particle) // Remove from the group
    particle.material.dispose() // Dispose of the material

    // Remove corresponding particle data
    particleData.pop()
  }
}

export const startPoisonCloudVFX = () => {
  startTime = Date.now() // Track the start time for the radius decrease
  $.scene.add(particleGroup)

  // Add the particle group to the scene
  const eventUuid = $.addEvent('renderer.update', deltaS => {
    // Update particle positions for a drifting effect
    updateParticles(particles, deltaS)

    // Cleanup after the total duration
    if (Date.now() - startTime >= totalDuration + 30000) {
      cleanup()
      $.removeEvent('renderer.update', eventUuid)
    }
  })

  const particleTexture = assetManager.getTexture('/images/cursor-icon.png') // Get the texture from the asset manager
  const cleanup = () => {
    // Remove all particles from the group and dispose of their materials
    particles.forEach(particle => {
      particleGroup.remove(particle) // Remove particle from the group

      // Dispose of the particle's material
      if (particle.material) {
        particle.material.dispose() // Dispose of the material
      }
    })

    // Clear the particles array
    particles.length = 0

    // Clear the particle data array
    particleData.length = 0

    // Dispose of the texture
    particleTexture.dispose()
  }

  $.addEvent('level.cleanup', cleanup)
}

/**
 * Determines if the player is inside the poison cloud.
 * @param playerPosition The player's position in 3D space.
 * @returns True if the player is inside the poison cloud, false otherwise.
 */
export const isPlayerInPoisonCloud = (playerPosition: { x: number; y: number; z: number }): boolean => {
  const elapsedTime = Date.now() - startTime // Time elapsed since start
  const progress = Math.min(elapsedTime / totalDuration, 1) // Progress from 0 to 1

  // Calculate the current inner radius of the ring
  const currentInnerRadius = initialInnerRadius * (1 - progress) // Linearly decrease the radius

  // Calculate the distance from the player to the center of the ring (XZ plane)
  const distanceToCenter = Math.sqrt(playerPosition.x ** 2 + playerPosition.z ** 2)

  // Check if the player is within the ring's outer and inner radii
  const isWithinRing = distanceToCenter >= currentInnerRadius && distanceToCenter <= outerRadius

  // Check if the player is within the vertical height of the ring
  const isWithinHeight = Math.abs(playerPosition.y) <= ringHeight / 2

  // Return true if the player is within both the ring and height
  return isWithinRing && isWithinHeight
}
