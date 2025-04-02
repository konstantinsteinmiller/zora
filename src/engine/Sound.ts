import $ from '@/global'
import useUser from '@/use/useUser.ts'
import { prependBaseUrl, randomInt, repeat } from '@/utils/function.ts'
import { Audio, AudioListener, AudioLoader, Group, PositionalAudio } from 'three'
import { EventEmitter } from 'events'
import { watch } from 'vue'

export const soundToTrackSrcMap: { [key: string]: string[] } = {
  hit: repeat(5, (_, i) => prependBaseUrl(`/sounds/hit/auahhhh-hurt-female-${i + 1}.ogg`)),
  spellShot: [
    prependBaseUrl('/sounds/spell/zushhh_flying_spell.ogg'),
    prependBaseUrl('/sounds/spell/flying_spell.ogg'),
  ],
  flap: repeat(4, (_, i) => prependBaseUrl(`/sounds/fly/flying-flap-${i + 1}.ogg`)),
  death: repeat(3, (_, i) => prependBaseUrl(`/sounds/death/death-${i + 1}.ogg`)),
  cough: repeat(3, (_, i) => prependBaseUrl(`/sounds/cough/cough-female-${i + 1}.ogg`)),
  item: [prependBaseUrl('/sounds/item/power-up-1.ogg'), prependBaseUrl('/sounds/item/power-up-2.ogg')],
  flee: [prependBaseUrl('/sounds/death/death-3.ogg')],
  fairyDust: [prependBaseUrl('/sounds/item/pickup-coin-1.ogg'), prependBaseUrl('/sounds/item/pickup-coin-2.ogg')],
  missingMana: [prependBaseUrl('/sounds/missingMana/missing-mana-xylophon.ogg')],
  battle: [prependBaseUrl('/music/thunderous-march_battle.ogg')],
  battleEnd: [prependBaseUrl('/music/drifting_through_quiet_valleys_slow-beautiful-ocarina-like_battle-end.ogg')],
  background: [
    prependBaseUrl('/music/beneath-the-soft-moonlight_slow-harmonic-beautiful_background-music.ogg'),
    // prependBaseUrl('/music/shadows-in-silence_slow-tired-powerless_main-menu.ogg'),
  ],
}

let singleton: any = null
export default () => {
  if (singleton !== null) return singleton

  const { userMusicVolume } = useUser()
  /* create camera listener */
  const emitter = new EventEmitter()
  const listener = new AudioListener()
  $.addOneTimeEvent('renderer.update', () => $.camera.add(listener))
  watch(
    () => userMusicVolume.value,
    () => {
      activeSoundsList.forEach((sound: any) => sound.setVolume(userMusicVolume.value * 0.25))
    }
  )

  const audioLoader = new AudioLoader($.loadingManager)

  singleton = {
    trackBuffersMap: new Map(),
    soundToTrackSrcMap,
    emitter,
  }

  const activeSoundsList: any[] = []

  singleton.createSounds = ({
    name,
    loop = false,
    volume = 1.0,
    refDist = 0,
    limit,
    random,
  }: {
    name: string
    loop: boolean
    random?: boolean
    volume: number
    refDist?: number
    limit?: number
  }): any[] => {
    const buffersList = singleton.trackBuffersMap.get(name)
    if (!buffersList || buffersList.length === 0) return []

    const soundsList: any[] = []
    const createSound = (buffer: any) => {
      const sound: any = refDist > 0 ? new PositionalAudio(listener) : new Audio(listener)
      sound.setBuffer(buffer)
      sound.setLoop(loop)
      sound.setVolume(volume)
      sound.name = name
      if (refDist > 0) sound?.setRefDistance?.(refDist)
      activeSoundsList.push(sound)
      return sound
    }

    if (random) {
      const random = randomInt(buffersList.length - 1)
      return [createSound(buffersList[random])]
    }

    /* return a list of all tracks for sound name */
    buffersList.forEach((buffer: AudioBuffer, index: number) => {
      if (limit && index >= limit) return
      const sound = createSound(buffer)
      soundsList.push(sound)
    })
    return soundsList
  }
  singleton.isSoundLoaded = (name: string) => {
    return singleton.trackBuffersMap.has(name)
  }

  singleton.load = (name: string, onProgress: () => number) => {
    const srcList = soundToTrackSrcMap[name]
    const trackBuffersList: AudioBuffer[] = []
    let counter = 0
    srcList.forEach((src: string) => {
      $.loadingManager.itemStart(src)
      audioLoader.load(
        src,
        buffer => {
          counter++
          trackBuffersList.push(buffer)

          if (counter === srcList.length) {
            singleton.trackBuffersMap.set(name, trackBuffersList)
          }
          $.loadingManager.itemEnd(src)
          singleton.emitter.emit('loaded:background', { name })
        },
        onProgress,
        error => {
          console.error(`Error loading ${src}:`, error)
          $.loadingManager.itemError(src)
        }
      )
    })
  }

  singleton.play = (
    name: string,
    options: {
      volume: number
      loop: boolean
      refDist: number
    }
  ) => {
    const buffersList = singleton.trackBuffersMap.get(name)
    if (!buffersList || buffersList.length === 0) {
      console.warn(`Sound '${name}' is not loaded.`)
      return
    }
    // const index = Math.floor(Math.random() * buffersList.length)
    const sound = singleton.createSounds({
      name,
      random: true,
      refDist: options.refDist || 0,
      volume: options.volume,
      loop: options.loop,
    })[0]

    if (sound) {
      singleton.emitter.emit(`${name}:play`)
      sound.play()
    }
  }

  singleton.stop = (name: string) => {
    activeSoundsList.find((sound: any) => sound.name === name)?.stop()
  }

  singleton.playRandomTrack = (soundsList: any[]) => {
    const random = randomInt(soundsList.length - 1)
    const sound = soundsList[random]
    sound.play()
  }
  singleton.attachToParent = (sound: PositionalAudio, owner: any) => {
    let soundsGroup = owner.mesh.children.find((child: any) => child.name === 'sounds-group')
    if (!soundsGroup) {
      soundsGroup = new Group()
      soundsGroup.name = 'sounds-group'
      soundsGroup.add(sound)
      owner.mesh.add(soundsGroup)
    } else {
      const foundOldSound = soundsGroup.children.find((child: any) => child.name === 'hit')
      if (foundOldSound) {
        soundsGroup.remove(foundOldSound)
        soundsGroup.add(sound)
      }
    }
  }
  singleton.addAndPlayPositionalSound = (
    entity: any,
    name: string,
    options: {
      volume: number
      loop?: boolean
      refDist?: number
    }
  ) => {
    if ($.sounds.isSoundLoaded(name)) {
      const positionalSound = $.sounds
        .createSounds({
          name,
          volume: options?.volume || 0.7,
          refDist: options?.refDist || 150,
          random: true,
        })
        .pop()

      positionalSound.name = name
      $.sounds.attachToParent(positionalSound, entity)
      positionalSound.play()
    }
  }

  singleton.loadSounds = () => {
    const soundNamesList = Object.keys(soundToTrackSrcMap)

    if (!singleton.trackBuffersMap?.length) {
      soundNamesList.forEach((name: string) =>
        $.sounds.load(name, (event: any) => $.fileLoader.onFileProgress(name, event))
      )
    }
  }
  singleton.loadBackgroundMusic = () => {
    const name = 'background'
    $.sounds.load(name, (event: any) => $.fileLoader.onFileProgress(name, event))
  }

  singleton.playBackgroundMusic = () => {
    const name = 'background'
    if (!singleton.trackBuffersMap.get(name)) {
      singleton.load(name)

      const onLoadedBackgroundMusic = () => {
        const onBgPlay = () => {
          // console.log(" 'background music started playing'")
          singleton.emitter.off(`${name}:play`, onBgPlay)
        }
        singleton.emitter.on(`${name}:play`, onBgPlay)
        /*!$.isDebug && */ const result = singleton.play(name, { volume: userMusicVolume.value * 0.25, loop: true })

        // const tryToPlay = setInterval(() => {
        //   const audio = new Audio(theAudioFile)
        //
        //   audio
        //     .play()
        //     .then(() => {
        //       clearInterval(tryToPlay)
        //     })
        //     .catch(error => {
        //       console.info('User has not interacted with document yet.')
        //     })
        // }, 5000)

        emitter.off(`loaded:${name}`, onLoadedBackgroundMusic)
      }
      emitter.on(`loaded:${name}`, onLoadedBackgroundMusic)
    } else {
      singleton.play(name, { volume: userMusicVolume.value * 0.25, loop: true })
    }
  }

  singleton.addInteractionDetection = () => {
    let isPlaying = false
    const eventsList = ['click', 'focus', 'touchstart', 'touchend', 'pointerdown', 'pointerup']
    const $soundDetector = document.querySelector('#sound-detector')
    const $mainApp = document.querySelector('#main-app')

    const prevent = event => {
      event.preventDefault()
    }
    document.addEventListener('contextmenu', prevent)
    setTimeout(() => {
      $.fileLoader.emitter.on('loaded-level', () => {
        console.log('on loaded-level: ')
        document.removeEventListener('contextmenu', prevent)
      })
    }, 500)

    const detectInteraction = event => {
      $mainApp?.removeChild($soundDetector as Node)
      if (!isPlaying) {
        try {
          //play video here
          $.sounds.playBackgroundMusic()
          isPlaying = true
          eventsList.forEach(eventName => {
            $soundDetector?.removeEventListener(eventName, detectInteraction, { bubbles: true, capture: false })
          })
        } catch (e) {
          console.warn(e.message)
        }
      }
    }
    eventsList.forEach(eventName => {
      $soundDetector?.addEventListener(eventName, detectInteraction, {
        bubbles: true,
        capture: false,
      })
    })
  }

  $.sounds = singleton

  return singleton
}
