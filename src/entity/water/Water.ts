import * as THREE from 'three'
import vertexShader from '@/entity/water/water.vert?raw'
import fragmentShader from '@/entity/water/water.frag?raw'
import state from '@/states/GlobalState'

export default (options: any) => {
  const mesh = new THREE.Mesh()

  mesh.material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1.0 },
      uEnvironmentMap: { value: options.environmentMap },
      uWavesAmplitude: { value: options.amplitude || 0.2 },
      uWavesFrequency: { value: options.frequency || 3.2 },
      uWavesPersistence: { value: options.persistence || 0.5 },
      uWavesLacunarity: { value: options.lacunarity || 2.5 },
      uWavesIterations: { value: 7 },
      uWavesSpeed: { value: options.speed || 0.5 },
      uTroughColor: { value: new THREE.Color('#186691') },
      uSurfaceColor: { value: new THREE.Color('#9bd8c0') },
      uPeakColor: { value: new THREE.Color('#bbd8e0') },
      uPeakThreshold: { value: 0.08 },
      uPeakTransition: { value: 0.07 },
      uTroughThreshold: { value: 0.02 },
      uTroughTransition: { value: 0.1 },
      uFresnelScale: { value: 0.8 },
      uFresnelPower: { value: 0.5 },
    },
    transparent: true,
    depthTest: true,
    side: THREE.DoubleSide,
  })

  mesh.geometry = new THREE.PlaneGeometry(1000, 1000, options.resolution || 512, options.resolution || 512)
  mesh.rotation.x = Math.PI * 0.5
  mesh.name = 'waterMesh'

  // mesh.material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
  mesh.position.set(0, 0.4, 0)

  const update = (elapsedTime: number) => {
    mesh.material.uniforms.uTime.value = elapsedTime
  }

  state.addEvent('renderer.update', (deltaInS: number, elapsedTime: number) => {
    update(elapsedTime)
  })

  if (!state.scene) {
    setTimeout(() => state.scene.add(mesh))
  } else state.scene.add(mesh)

  return mesh
}
