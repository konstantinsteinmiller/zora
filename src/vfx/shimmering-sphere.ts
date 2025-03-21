import state from '@/states/GlobalState'
import { prependBaseUrl } from '@/utils/function.ts'
import { EventEmitter } from 'events'
import { AdditiveBlending, Group, Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three'

// Load the custom particle texture
const textureLoader = new TextureLoader()
let particleTexture: any
const loadTexture = async () => {
  particleTexture = await textureLoader.loadAsync(prependBaseUrl('/images/glow.png')) // Replace with your image path
}
loadTexture()

// Define three gold tones
const goldColors = [
  0xffd700, // Bright gold
  0xdaa520, // Goldenrod
  0xb8860b, // Dark goldenrod
]
const particleCount = 350 // Number of particles
const sphereRadius = 0.65 // Radius of the sphere
const shimmerSpeed = 0.025 // Speed of the shimmering effect

// Store initial positions, offsets, and scales for particles
const particleData: {
  initialPosition: { x: number; y: number; z: number }
  shimmerOffset: { x: number; y: number; z: number }
  initialScale: number
}[] = []

export const startShimmeringSphere = (position: Vector3) => {
  const particles: Sprite[] = []

  const particleGroup = new Group()
  particleGroup.name = 'vfx-shimmering-sphere-particles'

  const emitter = new EventEmitter()
  state.scene.add(particleGroup)

  // Position the particle group at the specified location
  particleGroup.position.copy(position)

  // Initialize particles on the surface of the sphere
  for (let i = 0; i < particleCount; i++) {
    // Randomly assign one of the gold colors
    const goldColor = goldColors[Math.floor(Math.random() * goldColors.length)]

    const particleMaterial = new SpriteMaterial({
      map: particleTexture,
      color: goldColor, // Use the assigned gold color
      transparent: true,
      opacity: 0.5, // Reduced opacity for better visibility
      blending: AdditiveBlending,
      alphaTest: 0.45, // Lower alphaTest to discard more transparent pixels
      depthWrite: true,
      premultipliedAlpha: true, // Enable if the texture uses premultiplied alpha
    })

    const particle = new Sprite(particleMaterial)

    // Set the initial scale of the sprites
    const initialScale = 0.03 + Math.random() * 0.015 // Smaller scale between 0.03 and 0.045
    particle.scale.set(initialScale, initialScale, initialScale)

    // Disable raycasting for this sprite
    particle.raycast = null

    // Calculate initial position on the surface of the sphere
    const vertex = new Vector3()
    vertex.setFromSphericalCoords(
      sphereRadius,
      Math.acos(2 * Math.random() - 1), // Random theta
      2 * Math.PI * Math.random() // Random phi
    )

    const initialPosition = {
      x: vertex.x,
      y: vertex.y,
      z: vertex.z,
    }

    // Store initial position, shimmer offset, and initial scale
    particleData[i] = {
      initialPosition,
      shimmerOffset: { x: 0, y: 0, z: 0 },
      initialScale,
    }

    // Set initial position
    particle.position.set(initialPosition.x, initialPosition.y, initialPosition.z)

    // Add particle to the group and the particles array
    particleGroup.add(particle)
    particles.push(particle)
  }

  // Add the update event
  const eventUuid = state.addEvent('renderer.update', () => {
    // Update particle positions for a shimmering effect
    updateParticles(particles)
  })

  const updateParticles = (particles: Sprite[]) => {
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      const data = particleData[i]

      if (!particle || !data) continue

      // Add a small shimmer effect with reduced amplitude
      const shimmerAmplitude = 0.02 // Reduced amplitude for less wiggling
      data.shimmerOffset.x = Math.sin(Date.now() * shimmerSpeed + i) * shimmerAmplitude
      data.shimmerOffset.y = Math.cos(Date.now() * shimmerSpeed + i) * shimmerAmplitude
      data.shimmerOffset.z = Math.sin(Date.now() * shimmerSpeed + i) * shimmerAmplitude

      // Update particle position with shimmer effect
      particle.position.set(
        data.initialPosition.x + data.shimmerOffset.x,
        data.initialPosition.y + data.shimmerOffset.y,
        data.initialPosition.z + data.shimmerOffset.z
      )

      // Scale particles between 80% and 120% of their initial size
      const scaleFactor = 0.8 + 0.4 * Math.sin(Date.now() * shimmerSpeed + i) // Oscillates between 0.8 and 1.2
      const currentScale = data.initialScale * scaleFactor
      particle.scale.set(currentScale, currentScale, currentScale)
    }
  }

  const cleanup = () => {
    // Remove all particles from the group and dispose of their materials
    particles.forEach(particle => {
      particleGroup.remove(particle)
      if (particle.material) {
        particle.material.dispose()
      }
    })

    particles.length = 0
    particleData.length = 0
    particleTexture.dispose()
    state.removeEvent('renderer.update', eventUuid)
  }

  emitter.on('cleanup', () => {
    cleanup()
  })

  return emitter
}
