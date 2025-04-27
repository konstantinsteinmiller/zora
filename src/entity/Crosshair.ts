import { assetManager } from '@/engine/AssetLoader.ts'
import useUser from '@/use/useUser.ts'
import {
  CRITICAL_CHARGE_END_COLOR,
  CRITICAL_CHARGE_START_COLOR,
  DEFAULT_CHARGE_DURATION,
  INITIAL_ROTATION_SPEED,
  MAX_ROTATION_SPEED,
  MIN_CHARGE_CRITICAL_SPEED,
  MIN_CHARGE_END_COLOR,
  MIN_CHARGE_SPEED,
  MIN_CHARGE_START_COLOR,
} from '@/utils/constants.ts'
import { getChargeDuration } from '@/utils/function.ts'
import { TUTORIALS } from '@/utils/enums.ts'
import { remap } from '@/utils/function.ts'
import { lerp } from 'three/src/math/MathUtils.js'
import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, Sprite, SpriteMaterial } from 'three'
import $ from '@/global'
import SpellFire from '@/entity/SpellFire'

const Crosshair = () => {
  const createCrosshair = () => {
    const crosshair = assetManager.getTexture('/images/crosshair/crosshair-transparent.avif')
    crosshair.anisotropy = $.renderer.capabilities.getMaxAnisotropy()

    const crosshairSprite = new Sprite(
      new SpriteMaterial({
        map: crosshair,
        color: 0xffffff,
        fog: false,
        depthTest: false,
        depthWrite: false,
      })
    )

    $.addEvent('renderer.resize', () => {
      const aspect = innerWidth / innerHeight
      $.uiCamera.left = -aspect
      $.uiCamera.right = aspect
      $.uiCamera.top = 1
      $.uiCamera.bottom = -1
      $.uiCamera.updateProjectionMatrix()

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
    const createPlaneFromTexture = (src: string) => {
      const texture = assetManager.getTexture(src)
      const material = new MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
      })

      const size = 0.18
      const geometry = new PlaneGeometry(size, size)
      const mesh = new Mesh(geometry, material)
      mesh.name = 'crosshairMesh'
      mesh.position.set(0, 0, 0) // Center it in the HUD
      return mesh
    }
    const crosshairStar = createPlaneFromTexture('/images/crosshair/crosshair-stars.png')
    const crosshairDots = createPlaneFromTexture('/images/crosshair/crosshair-dots.avif')
    crosshairStar.name = 'crosshairStar'
    crosshairDots.name = 'crosshairDots'

    /* create groups */
    const crosshairGroup = new Group()
    crosshairGroup.name = 'crosshairGroup'
    crosshairGroup.add(crosshairSprite)

    const crosshairRotatingGroup = new Group()
    crosshairRotatingGroup.name = 'crosshairRotatingGroup'
    crosshairRotatingGroup.add(crosshairStar)
    crosshairRotatingGroup.add(crosshairDots)
    crosshairGroup.add(crosshairRotatingGroup)

    $.uiScene.add(crosshairGroup)
    crosshairDots.visible = false
    crosshairStar.visible = false

    return { crosshairRotatingGroup, crosshairStar, crosshairDots }
  }

  const { crosshairRotatingGroup, crosshairStar, crosshairDots } = createCrosshair()

  const entityChargeDuration = getChargeDuration($.player)
  let rotationSpeed: number = INITIAL_ROTATION_SPEED
  let chargeStartTime: number = 0

  const { fireRaycaster } = SpellFire()

  let canFire = false
  let forcedSpellRelease = false
  let chargeEmitter: any = null

  /* release shot if attack button is released */
  $.addEvent('controls.attack1.up', () => {
    const entity = $.player
    canFire && fireRaycaster(rotationSpeed, entity, $.enemy)
    forcedSpellRelease = false
    canFire = false
    crosshairDots.visible = false
    crosshairStar.visible = false
    entity.currentSpell.charge = 0

    entity.calcAttackMpDamage(entity, rotationSpeed)

    chargeEmitter?.emit('cleanup')
    chargeIndicatorNebulaSystem = null
    chargeStartTime = Date.now()
  })

  const { userSoundVolume, tutorialPhase, userTutorialsDoneMap } = useUser()
  let wasMissingManaTutorialShown = false
  /* start charging spell on mouse down and hold */
  $.addEvent('controls.attack1.down', () => {
    canFire = false
    forcedSpellRelease = false
    crosshairDots.visible = false
    crosshairStar.visible = false
    $.player.currentSpell.charge = 0
    chargeStartTime = Date.now()
    /* warn player with sound that he might harm himself because of missing mana */
    if ($.player.mp < $.player.currentSpell.mana * 0.5) {
      $.sounds.addAndPlayPositionalSound($.player, 'missingMana', { volume: 0.5 * userSoundVolume.value })

      if (userTutorialsDoneMap.value[TUTORIALS.MISSING_MANA] || wasMissingManaTutorialShown) return
      tutorialPhase.value = TUTORIALS.MISSING_MANA
      wasMissingManaTutorialShown = true
    }
  })

  let chargeIndicatorNebulaSystem: any = null
  let firstCharge = true

  $.addEvent('renderer.update', async (deltaInS: number) => {
    const entity = $?.player
    if (!entity.currentSpell || !entity || entity.isDead() || $.isBattleOver) return

    /* while attack button pressed => rotate crosshair */
    if (!$.controls.attack || forcedSpellRelease || !document.pointerLockElement) return

    if (!chargeIndicatorNebulaSystem) {
      chargeIndicatorNebulaSystem = true
      const { nebulaSystem, chargeEmitter: emitter } = await entity.createChargeIndicator(entity)
      chargeIndicatorNebulaSystem = nebulaSystem
      chargeEmitter = emitter
    }
    if (chargeIndicatorNebulaSystem) {
      entity.updateChargeIndicator(entity, rotationSpeed, chargeIndicatorNebulaSystem)
    }

    /* ~ 12 - 4 seconds */
    if (firstCharge) {
      chargeStartTime = Date.now()
      firstCharge = false
    }
    const elapsedChargeS = (Date.now() - chargeStartTime) / 1000
    const rotationDuration = remap(0, DEFAULT_CHARGE_DURATION, 0, entityChargeDuration, elapsedChargeS)
    const rotationN = Math.min(rotationDuration / entityChargeDuration, 1) // 0 - 1 -> value between [0,1]
    rotationSpeed = lerp(INITIAL_ROTATION_SPEED, MAX_ROTATION_SPEED, rotationN)
    entity.currentSpell.charge = rotationN
    crosshairRotatingGroup.rotation.z -= rotationSpeed * deltaInS

    if (rotationSpeed > MIN_CHARGE_SPEED) {
      /* allow successful spell release */
      canFire = true
    }
    if (rotationSpeed < MIN_CHARGE_CRITICAL_SPEED) {
      crosshairStar.material.color.lerpColors(
        MIN_CHARGE_START_COLOR,
        MIN_CHARGE_END_COLOR,
        remap(0, 0.7, 0, 1, rotationN) /*
         */
      )
      crosshairDots.visible = false
      crosshairStar.visible = true
    } else if (rotationSpeed < MAX_ROTATION_SPEED) {
      /* switch to dots and blueish color */
      crosshairDots.material.color.lerpColors(
        CRITICAL_CHARGE_START_COLOR,
        CRITICAL_CHARGE_END_COLOR,
        remap(0.8, 1, 0.4, 1, rotationN) /*
         */
      )
      crosshairStar.visible = false
      crosshairDots.visible = true
    } else {
      /* spell overload -> forced release of the charged shot and receive damage */
      // console.log('rotationSpeed: ', rotationSpeed)
      fireRaycaster(rotationSpeed, $.player, $.enemy)
      canFire = false
      forcedSpellRelease = true
      entity.currentSpell.charge = 0
      $.controls.previous.attack = false
      $.controls.attack = false
      crosshairDots.visible = false
      crosshairStar.visible = false
      chargeEmitter.emit('cleanup')
      chargeIndicatorNebulaSystem = null
      entity.calcAttackMpDamage(entity, rotationSpeed)
    }
  })
}
export default Crosshair
