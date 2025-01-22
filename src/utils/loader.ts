import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { browse } from '../tool/function.js'

const loaderGlb = new GLTFLoader()

export const loadWorld = async path => {
  const glb = await loaderGlb.loadAsync(path)
  const visualsList = []
  const collidersList = []
  const areasList = []

  for (const mesh of glb.scene.children) {
    const name = mesh.name
    if (name.includes('area')) {
      areasList.push(mesh)
    } else if (name.includes('collider')) {
      collidersList.push(mesh)
    } else {
      visualsList.push(mesh)
    }
    // if (mesh.name.includes('area')) {
    //   areasList.push(mesh)
    // } else
    // if (mesh.name.includes('visual')) {
    //   visualsList.push(mesh)
    // } else if( mesh.name.includes('collider') ) {
    //   collidersList.push(mesh)
    // }
  }

  return { visuals: visualsList, colliders: collidersList, areas: areasList }
}

export const loadEntity = async path => {
  const glb = await loaderGlb.loadAsync(path)
  const mesh = glb.scene.children[0]
  browse(mesh, m => (m.castShadow = true))
  mesh.clips = glb.animations

  return mesh
}
