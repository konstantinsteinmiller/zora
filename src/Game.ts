import FileLoader from '@/engine/FileLoader.ts'
import Sound from '@/engine/Sound.ts'
import state from '@/states/GlobalState'
import { Scene } from 'three'
import Light from '@/engine/Light'
import Renderer from '@/engine/Renderer'
import Physics from '@/engine/Physics'
import Camera from '@/engine/Camera'

export default async (level = 'water-arena') => {
  await Physics()
  state.scene = new Scene()
  state.uiScene = new Scene()

  const levelConfig = await import(`@/entity/levels/${level}/config.ts`)
  const { phi, theta } = levelConfig.startPositions[0]?.orientation || { phi: 0, theta: 0 }

  FileLoader()
  Camera()
  state.thirdPersonCamera.setCameraRotation(phi, theta)
  state.fpsCamera.setCameraRotation(phi, theta)

  Sound()

  Light()
  Renderer()

  state.isEngineInitialized = true
  return true
}
