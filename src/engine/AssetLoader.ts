import type { Object3D } from 'three'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let loader: any = null

export default () => {
  if (loader !== null) {
    return loader
  }

  loader = {}

  loader.loadMesh = async (publicPath: string, parent: Object3D, scale: number = 0.1, shadows: boolean = true) => {
    if (publicPath.endsWith('.fbx')) {
      return loader.loadFBXMesh(publicPath, parent, scale, shadows)
    }
    if (publicPath.endsWith('.glb')) {
      return loader.loadGLBMesh(publicPath, parent, scale, shadows)
    }
    return loader.loadGLBMesh(publicPath, parent, scale, shadows)
  }

  loader.loadGLBMesh = async (publicPath: string, parent: Object3D, scale: number, shadows: boolean = true) => {
    const loaderGlb = new GLTFLoader()
    const glb = await loaderGlb.loadAsync(publicPath)
    console.log('glb: ', glb)
    if (shadows) {
      glb.scene.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          console.log('child: ', child)
          child.scale.setScalar(scale)
          child.castShadow = true
          child.receiveShadow = true
          parent.add(child)
        }
      })
    }
    return glb.scene
  }

  loader.loadFBXMesh = async (publicPath: string, parent: Object3D, scale: number, shadows: boolean = true) => {
    const loaderFbx = new FBXLoader()
    const fbx: any = await loaderFbx.loadAsync(publicPath)

    if (shadows) {
      fbx.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          // console.log('child: ', child)
          if (scale >= 0) child.scale.setScalar(scale)
          child.castShadow = true
          child.receiveShadow = true
          parent.add(child)
        }
      })
      return fbx.scene
    }
  }
  return loader
}
