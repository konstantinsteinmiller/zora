import { BackSide, Mesh, MeshToonMaterial, NearestFilter, ShaderMaterial, TextureLoader } from 'three'
import $ from '@/global'
import TOON_TONE from '@/assets/images/textures/threeTone.jpg'

export const solidify = (mesh: Mesh) => {
  const THICKNESS = 0.01
  const geometry = mesh.geometry
  const material = new ShaderMaterial({
    vertexShader: `
        void main() {
        vec3 newPosition = position + normal * ${THICKNESS};
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
    fragmentShader: `
        void main() {
          gl_FragColor = vec4(0, 0, 0, 1.0);
        }
      `,
    side: BackSide,
  })

  const outline = new Mesh(geometry, material)
  $.scene.add(outline)

  $.addEvent('level.cleanup', () => {
    outline.geometry.dispose()
    outline.material.dispose()
    $.scene.remove(outline)
  })
  $.addEvent('level.cleanup', () => {
    outline.geometry.dispose()
    outline.material.dispose()
    $.scene.remove(outline)
  })
}

export const getToonMaterial = async (color = '#4e62f9') => {
  const texture = await new TextureLoader().loadAsync(TOON_TONE)
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter

  const material = new MeshToonMaterial({
    color,
    gradientMap: texture,
  })

  return material
}
export default () => getToonMaterial()
