import state from '@/states/GlobalState'
import { prependBaseUrl } from '@/utils/function.ts'
import { AdditiveBlending, Mesh, ShaderMaterial, SphereGeometry, TextureLoader, Vector3 } from 'three'
import { EventEmitter } from 'events'

// Load the custom glow texture
const textureLoader = new TextureLoader()

// Define the GLSL shaders
const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentShader = `
    uniform sampler2D glowTexture;
    uniform float time;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv * 20.0; // Increase the scaling factor for more tiling
        uv.x += sin(time + vUv.y * 5.0) * 0.1; // Add horizontal animation
        uv.y += cos(time + vUv.x * 5.0) * 0.1; // Add vertical animation

        vec4 glowColor = texture2D(glowTexture, fract(uv)); // Use fract to tile the texture
        glowColor.rgb *= 2.0; // Brighten the glow

        gl_FragColor = glowColor;
    }
`

let sphereGeometry: any, glowTexture: any, shaderMaterial: any, sphereMesh: any
const init = async () => {
  glowTexture = await textureLoader.loadAsync(prependBaseUrl('/images/glow.avif')) // Replace with your glow texture

  // Create a sphere geometry
  const sphereRadius = 0.65
  sphereGeometry = new SphereGeometry(sphereRadius, 32, 32)

  // Create a custom shader material
  shaderMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowTexture: { value: glowTexture }, // Pass the glow texture
      time: { value: 0.0 }, // Time for animation
    },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  })

  // Create a sphere mesh with the custom shader material
  sphereMesh = new Mesh(sphereGeometry, shaderMaterial)
  sphereMesh.name = 'glow-sphere'
}
init()

// Function to start the effect
export const startShimmeringSphere = (position: Vector3) => {
  const emitter = new EventEmitter()
  state.scene.add(sphereMesh)

  // Position the sphere at the specified location
  sphereMesh.position.copy(position)

  // Add the update event
  const eventUuid = state.addEvent('renderer.update', deltaS => {
    // Update the time uniform for animation
    shaderMaterial.uniforms.time.value += deltaS
  })

  const cleanup = () => {
    // Remove the sphere from the scene
    state.scene.remove(sphereMesh)

    // Dispose of the geometry and material
    sphereGeometry.dispose()
    shaderMaterial.dispose()
    glowTexture.dispose()

    // Remove the update event
    state.removeEvent('renderer.update', eventUuid)
  }

  emitter.on('cleanup', () => {
    cleanup()
  })

  return emitter
}
