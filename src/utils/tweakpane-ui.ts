import { Pane } from 'tweakpane'
import * as THREE from 'three'

export function setupUI({ waterResolution, water, ground }: any) {
  const pane = new Pane()

  // Water parameters folder
  const waterFolder = pane.addFolder({ title: 'Water' })

  const geometryFolder = waterFolder.addFolder({ title: 'Geometry' })

  geometryFolder.addBinding(waterResolution, 'size', { min: 2, max: 1024, step: 2, label: 'Resolution' }).on('change', ({ value }) => {
    console.log(value)
    // Update geometry with new dimensions
    const newGeometry = new THREE.PlaneGeometry(2, 2, waterResolution.size, waterResolution.size)
    water.geometry.dispose()
    water.geometry = newGeometry
  })

  // Waves
  const wavesFolder = waterFolder.addFolder({ title: 'Waves' })
  wavesFolder.addBinding(water.material.uniforms.uWavesAmplitude, 'value', {
    min: 0,
    max: 1.0,
    label: 'Amplitude',
  })
  wavesFolder.addBinding(water.material.uniforms.uWavesFrequency, 'value', {
    min: 0.1,
    max: 10,
    label: 'Frequency',
  })
  wavesFolder.addBinding(water.material.uniforms.uWavesPersistence, 'value', {
    min: 0,
    max: 1,
    label: 'Persistence',
  })
  wavesFolder.addBinding(water.material.uniforms.uWavesLacunarity, 'value', {
    min: 0,
    max: 3,
    label: 'Lacunarity',
  })
  wavesFolder.addBinding(water.material.uniforms.uWavesIterations, 'value', {
    min: 1,
    max: 10,
    step: 1,
    label: 'Iterations',
  })
  wavesFolder.addBinding(water.material.uniforms.uWavesSpeed, 'value', {
    min: 0,
    max: 1,
    label: 'Speed',
  })

  // Color
  const colorFolder = waterFolder.addFolder({ title: 'Color' })

  colorFolder.addBinding(water.material.uniforms.uOpacity, 'value', {
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Opacity',
  })

  colorFolder.addBinding(water.material.uniforms.uTroughColor, 'value', {
    label: 'Trough Color',
    view: 'color',
    color: { type: 'float' },
  })
  colorFolder.addBinding(water.material.uniforms.uSurfaceColor, 'value', {
    label: 'Surface Color',
    view: 'color',
    color: { type: 'float' },
  })
  colorFolder.addBinding(water.material.uniforms.uPeakColor, 'value', {
    label: 'Peak Color',
    view: 'color',
    color: { type: 'float' },
  })
  colorFolder.addBinding(water.material.uniforms.uPeakThreshold, 'value', {
    min: 0,
    max: 0.5,
    label: 'Peak Threshold',
  })
  colorFolder.addBinding(water.material.uniforms.uPeakTransition, 'value', {
    min: 0,
    max: 0.5,
    label: 'Peak Transition',
  })
  colorFolder.addBinding(water.material.uniforms.uTroughThreshold, 'value', {
    min: -0.5,
    max: 0,
    label: 'Trough Threshold',
  })
  colorFolder.addBinding(water.material.uniforms.uTroughTransition, 'value', {
    min: 0,
    max: 0.5,
    label: 'Trough Transition',
  })

  // Fresnel
  const fresnelFolder = waterFolder.addFolder({ title: 'Fresnel' })
  fresnelFolder.addBinding(water.material.uniforms.uFresnelScale, 'value', {
    min: 0,
    max: 1,
    label: 'Scale',
  })
  fresnelFolder.addBinding(water.material.uniforms.uFresnelPower, 'value', {
    min: 0,
    max: 3,
    label: 'Power',
  })

  // Add Caustics controls
  const causticsFolder = waterFolder.addFolder({ title: 'Caustics' })
  causticsFolder.addBinding(ground.material.uniforms.uCausticsColor, 'value', {
    label: 'Color',
    view: 'color',
    color: { type: 'float' },
  })
  causticsFolder.addBinding(ground.material.uniforms.uCausticsIntensity, 'value', {
    min: 0,
    max: 2,
    label: 'Intensity',
  })
  causticsFolder.addBinding(ground.material.uniforms.uCausticsScale, 'value', {
    min: 0,
    max: 200,
    label: 'Scale',
  })
  causticsFolder.addBinding(ground.material.uniforms.uCausticsSpeed, 'value', {
    min: 0,
    max: 1,
    label: 'Speed',
  })
  causticsFolder.addBinding(ground.material.uniforms.uCausticsOffset, 'value', {
    min: 0,
    max: 2,
    label: 'Offset',
  })
  causticsFolder.addBinding(ground.material.uniforms.uCausticsThickness, 'value', {
    min: 0,
    max: 1,
    label: 'Thickness',
  })
}
