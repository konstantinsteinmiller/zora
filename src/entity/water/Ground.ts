import * as THREE from 'three'
import vertexShader from '@/entity/water/caustics.vert?raw'
import fragmentShader from '@/entity/water/caustics.frag?raw'
import state from '@/states/GlobalState'

export default (options: any) => {
  const mesh = new THREE.Mesh()
  mesh.material = new THREE.ShaderMaterial({
    // side: THREE.DoubleSide,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: options.texture },
      uTime: { value: 0.0 },
      uCausticsColor: { value: new THREE.Color('#ffffff') },
      uCausticsIntensity: { value: 0.2 },
      uCausticsScale: { value: 20.0 },
      uCausticsSpeed: { value: 1.0 },
      uCausticsThickness: { value: 0.4 },
      uCausticsOffset: { value: 0.75 },
    },
  })

  mesh.geometry = new THREE.PlaneGeometry(1000, 1000)
  mesh.rotation.x = -Math.PI * 0.5
  mesh.position.y = 0.2

  const update = (time: number) => {
    mesh.material.uniforms.uTime.value = time
  }

  state.addEvent('renderer.update', (deltaInS: number, elapsedTime: number) => {
    update(elapsedTime)
  })

  if (!state.scene) {
    setTimeout(() => state.scene.add(mesh))
  } else state.scene.add(mesh)

  return mesh
}
