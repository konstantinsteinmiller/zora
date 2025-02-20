import AssetLoader from '@/engine/AssetLoader.ts'
import { Object3D } from 'three'
import state from '@/states/GlobalState'

export default async () => {
  if (state.mountainArena) {
    return state.mountainArena
  }

  state.mountainArena = new Object3D()
  const { loadMesh } = AssetLoader()
  loadMesh(
    'worlds/arenas/mountain-arena.fbx',
    state.mountainArena,
    35 /*, (scene: Object3D) => {
    console.log('callback: ')
    scene.position.set(0, 0.5, 0)
  }*/
  )
  state.mountainArena.position.set(0, 0.5, 0)
  const createColliders = () => {}

  state.mountainArena.name = 'MountainArenaContainer'
  // mesh.objects = objects
  state.scene.add(state.mountainArena)

  return state.mountainArena
}
