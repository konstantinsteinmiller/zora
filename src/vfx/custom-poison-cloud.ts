import $ from '@/global'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three'

const particleCount = 10000 // Number of particles
const updateParticles = (particles: any) => {
  const positions = particles.attributes.position.array
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] += 0.05 // Move particles upward (y-axis)
    positions[i * 3] += (Math.random() - 0.5) * 0.1 // Add some horizontal drift (x-axis)
    positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1 // Add some depth drift (z-axis)

    // Reset particles that move out of bounds
    if (positions[i * 3 + 1] > 25) {
      positions[i * 3] = (Math.random() - 0.5) * 50 // x
      positions[i * 3 + 1] = -25 // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 // z
    }
  }
}

export const startPoisonCloudVFX = () => {
  // Create a particle system
  const particles = new BufferGeometry()
  const positions = new Float32Array(particleCount * 3) // Each particle has x, y, z coordinates
  const colors = new Float32Array(particleCount * 3) // Each particle has r, g, b colors

  // Initialize particle positions and colors
  for (let i = 0; i < particleCount; i++) {
    // Randomize positions within a 100x10x100 box
    positions[i * 3] = (Math.random() - 0.5) * 100 // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10 // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100 // z

    // Set colors (green to dark green)
    colors[i * 3] = Math.random() * 0.5 // r (0 to 0.5)
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5 // g (0.5 to 1)
    colors[i * 3 + 2] = Math.random() * 0.2 // b (0 to 0.2)
  }

  // Add positions and colors to the geometry
  particles.setAttribute('position', new BufferAttribute(positions, 3))
  particles.setAttribute('color', new BufferAttribute(colors, 3))

  // Create a material for the particles
  const particleMaterial = new PointsMaterial({
    size: 0.2, // Size of each particle
    vertexColors: true, // Use vertex colors
    transparent: true,
    opacity: 0.8,
    blending: AdditiveBlending, // Additive blending for a glowing effect
  })

  // Create the particle system
  const particleSystem = new Points(particles, particleMaterial)
  $.scene.add(particleSystem)

  const cleanup = () => {
    // Remove the particle system from the scene
    $.scene.remove(particleSystem)

    // Dispose of the geometry and material
    particles.dispose()
    particleMaterial.dispose()
  }

  // Add the particle group to the scene
  const eventUuid = $.addEvent(`renderer.update`, () => {
    // Update particle positions for a drifting effect
    updateParticles(particles)

    // Mark the positions as needing an update
    particles.attributes.position.needsUpdate = true

    setTimeout(() => {
      cleanup()
      $.removeEvent(`renderer.update`, eventUuid)
    }, 10000)
  })
}
