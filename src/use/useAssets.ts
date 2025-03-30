import { assetManager } from '@/engine/AssetLoader.ts'
import { characterAnimationNamesList } from '@/utils/constants.ts'
import { prependBaseUrl } from '@/utils/function.ts'
import { ref } from 'vue'

const loadingProgress = ref(0)
const worldLoadingProgress = ref(0)
const areAllAssetsLoaded = ref(false)

export default () => {
  // const outerWorldAssetsList: string[] = [
  // ]
  const arenaAssetsList: string[] = [
    prependBaseUrl('/draco/draco_decoder.js'),
    '/worlds/arenas/water-arena.comp.glb',
    '/worlds/arenas/water-arena-navmesh.fbx',
    '/models/power-ups/swords.comp.glb',
    '/models/power-ups/breast_plate.comp.glb',
    '/images/glow.png',
    '/images/star/star-64x64.png',
    '/images/fairy-dust/fairy-dust-100x120.png',
    '/images/cursor-icon.png',
    '/images/crosshair/crosshair-transparent.avif',
    '/images/crosshair/crosshair-stars.png',
    '/images/crosshair/crosshair-dots.avif',
    '/images/logo/Zora_logo_512x512.png',
    '/worlds/city-1/city-1.comp.glb',
    '/worlds/city-1/city-1-houses.comp.glb',
    '/worlds/city-1/city-1-navmesh.fbx',
  ]
  const characterAnimsList = [
    '/models/nature-fairy-1/nature_fairy_1.fbx',
    '/models/thunder-fairy-1/thunder_fairy_1.fbx',
  ]

  const updateProgress = () => {
    loadingProgress.value += +(100 / assetManager.loadingPromises.length).toFixed(2)
    worldLoadingProgress.value = loadingProgress.value
  }
  const updateWorldProgress = () => {
    worldLoadingProgress.value += +(100 / assetManager.loadingPromises.length).toFixed(2)
  }

  const mapMeshesAndTextures = (src: string) => {
    if (src.endsWith('.fbx') || src.endsWith('.glb') || src.endsWith('.gltf')) {
      return assetManager.loadMesh(src)
    } else if (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.avif')) {
      return assetManager.loadTexture(src)
    }
  }

  const preloadAssets = async () => {
    if (areAllAssetsLoaded.value) return
    try {
      // Load assets in parallel
      arenaAssetsList
        .map(mapMeshesAndTextures)
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

      setTimeout(async () => {
        await Promise.all(assetManager.loadingPromises.map(promise => promise?.then(updateProgress)))

        // outerWorldAssetsList.map(mapMeshesAndTextures)
        // await Promise.all(assetManager.loadingPromises.map(promise => promise?.then(updateWorldProgress)))

        areAllAssetsLoaded.value = true
        assetManager.loadingPromises = []
      }, 300)
      // console.log('All assets preloaded successfully', assetManager)
    } catch (error) {
      console.error('Asset loading error:', error)
    }
  }

  return {
    loadingProgress,
    worldLoadingProgress,
    preloadAssets,
  }
}
