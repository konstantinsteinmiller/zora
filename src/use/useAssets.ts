import { assetManager } from '@/engine/AssetLoader.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import { ref } from 'vue'

const loadingProgress = ref(0)
const areAllAssetsLoaded = ref(false)
export default () => {
  const assetsList: string[] = [
    '/worlds/arenas/water-arena.comp.glb',
    '/models/power-ups/swords.comp.glb',
    '/models/power-ups/breast_plate.comp.glb',
    '/images/glow.png',
    '/images/star/star-64x64.png',
    '/images/fairy-dust/fairy-dust-100x120.png',
    '/images/cursor-icon.png',
    '/images/crosshair/crosshair-transparent.avif',
    '/images/crosshair/crosshair-stars.png',
    '/images/crosshair/crosshair-dots.avif',
  ]
  const characterAnimsList = [
    '/models/nature-fairy-1/nature_fairy_1.fbx',
    '/models/thunder-fairy-1/thunder_fairy_1.fbx',
  ]

  const updateProgress = () => {
    loadingProgress.value += +(100 / assetManager.loadingPromises.length).toFixed(2)
  }

  const preloadAssets = async () => {
    if (areAllAssetsLoaded.value) return
    try {
      // Load assets in parallel
      // await Promise.all(
      assetsList
        .map(src => {
          if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
            return assetManager.loadMesh(src) /*?.then(updateProgress)*/
          } else if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.avif')) {
            return assetManager.loadTexture(src) /*.then(updateProgress)*/
          }
        })
        .concat([
          assetManager.loadCubeTexture([
            '/images/skybox/px.avif',
            '/images/skybox/nx.avif',
            '/images/skybox/py.avif',
            '/images/skybox/ny.avif',
            '/images/skybox/pz.avif',
            '/images/skybox/nz.avif',
          ]),
          // .then(updateProgress),
        ])
        .concat(
          characterAnimsList.reduce((acc, src) => {
            if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
              acc.concat(
                assetManager.loadCharacterAnims({ src, animsList: characterAnimationNamesList })
                // .map(promise => promise?.then(updateProgress))
              )
            }
            return acc
          }, [])
        )
      // )

      setTimeout(async () => {
        await Promise.all(assetManager.loadingPromises.map(promise => promise?.then(updateProgress)))
        areAllAssetsLoaded.value = true
      }, 300)
      // console.log('All assets preloaded successfully', assetManager)
    } catch (error) {
      console.error('Asset loading error:', error)
    }
  }

  return {
    loadingProgress,
    preloadAssets,
  }
}
