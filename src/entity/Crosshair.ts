import { clamp } from 'three/src/math/MathUtils'
import { Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial, TextureLoader } from 'three'
import state from '@/states/GlobalState'
import SpellFire from '@/entity/SpellFire'

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton
  singleton = {}

  const createCrosshair = () => {
    const textureLoader = new TextureLoader()
    const crosshair = textureLoader.load('images/crosshair/crosshair-transparent.png')
    crosshair.anisotropy = state.renderer.capabilities.getMaxAnisotropy()

    const crosshairSprite = new Sprite(
      new SpriteMaterial({
        map: crosshair,
        color: 0xffffff,
        fog: false,
        depthTest: false,
        depthWrite: false,
      })
    )

    // const originalScale = crosshairSprite.scale.clone()
    state.addEvent('renderer.resize', () => {
      const aspect = innerWidth / innerHeight
      state.uiCamera.left = -aspect
      state.uiCamera.right = aspect
      state.uiCamera.top = 1
      state.uiCamera.bottom = -1
      state.uiCamera.updateProjectionMatrix()

      // Scale crosshair based on screen size
      const scaleFactor = Math.min(innerWidth, innerHeight) * 0.0015 * 0.15
      crosshairSprite.scale.set(scaleFactor, scaleFactor, 1)

      crosshairSprite.position.set(0, 0, -10)
      crosshairSprite.center.set(0.5, 0.5)
    })
    crosshairSprite.scale.set(0.15, 0.15, 1)
    crosshairSprite.position.set(0, 0, -10)
    crosshairSprite.center.set(0.5, 0.5)

    // load crosshair stars Texture
    const createPlaneFromTexture = (path: string) => {
      const texture = new TextureLoader().load(path)
      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      })

      const size = 0.18
      const geometry = new PlaneGeometry(size, size)
      const mesh = new Mesh(geometry, material)
      mesh.position.set(0, 0, 0) // Center it in the HUD
      return mesh
    }
    const crosshairStar = createPlaneFromTexture('images/crosshair/crosshair-stars.png')
    const crosshairDots = createPlaneFromTexture('images/crosshair/crosshair-dots.png')

    /* create groups */
    const crosshairGroup = new Group()
    crosshairGroup.add(crosshairSprite)
    const crosshairRotatingGroup = new Group()
    crosshairRotatingGroup.add(crosshairStar)
    crosshairRotatingGroup.add(crosshairDots)
    crosshairGroup.add(crosshairRotatingGroup)

    state.uiScene.add(crosshairGroup)
    crosshairDots.visible = false
    crosshairStar.visible = false

    return { crosshairRotatingGroup, crosshairStar, crosshairDots }
  }

  const { crosshairRotatingGroup, crosshairStar, crosshairDots } = createCrosshair()

  const INITIAL_ROTATION_SPEED = 0.005
  let rotationSpeed: number = INITIAL_ROTATION_SPEED

  const startColor = new Color(0x7aafc1)
  const endColor = new Color(0xff0000)

  const { fireRaycaster } = SpellFire()

  let canFire = false
  let forcedSpellRelease = false

  /* release shot if attack button is released */
  state.addEvent('input.attack1.up', () => {
    canFire && fireRaycaster(rotationSpeed)
    forcedSpellRelease = false
    canFire = false
    crosshairDots.visible = false
    crosshairStar.visible = false
    rotationSpeed = INITIAL_ROTATION_SPEED
  })

  state.addEvent('renderer.update', (deltaInS: number) => {
    if (!state.player.currentSpell) return

    if (!state.controls.attack || forcedSpellRelease) return
    /* while attack button pressed => rotate crosshair */

    crosshairRotatingGroup.rotation.z -= rotationSpeed
    const rotationIncrease = 0.006 * state.player.currentSpell.speed * deltaInS
    rotationSpeed += rotationIncrease
    rotationSpeed = clamp(rotationSpeed, 0.0000001, 0.08)

    if (rotationSpeed > 0.03) {
      canFire = true
    }
    if (rotationSpeed < 0.06) {
      crosshairStar.material.color.lerpColors(startColor, endColor, rotationSpeed * 15)
      crosshairDots.visible = false
      crosshairStar.visible = true
    } else if (rotationSpeed < 0.08) {
      /* switch to dots and blueish color */
      crosshairDots.material.color.lerpColors(new Color(0xd4dcfc), new Color(0x3d8dff), rotationSpeed * 12)
      crosshairStar.visible = false
      crosshairDots.visible = true
    } else {
      /* spell overload -> forced release of the charged shot and receive damage */
      fireRaycaster(rotationSpeed)
      canFire = false
      forcedSpellRelease = true
      state.controls.previous.attack = false
      state.controls.attack = false
      crosshairDots.visible = false
      crosshairStar.visible = false
      rotationSpeed = INITIAL_ROTATION_SPEED
    }
  })
}
