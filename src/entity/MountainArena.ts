import AssetLoader from '@/engine/AssetLoader.ts'
import { Object3D } from 'three'
import state from '@/states/GlobalState'

export default () => {
  if (state.mountainArena) {
    return state.mountainArena
  }

  state.mountainArena = new Object3D()
  const { loadMesh } = AssetLoader()
  loadMesh('/worlds/arenas/mountain-arena.fbx', state.mountainArena, 35)

  const createColliders = () => {}

  state.mountainArena.name = 'MountainArenaContainer'
  // mesh.objects = objects
  state.scene.add(state.mountainArena)

  return state.mountainArena
}
