import { ref } from 'vue'
import type { Ref } from 'vue'
import useUserDb from '@/use/useUserDb'

const userSoundVolume: Ref<number> = ref(70)
const userMusicVolume: Ref<number> = ref(5)
const userLanguage: Ref<string> = ref(navigator?.language?.split('-')[0] || 'en')

const { storeUser } = useUserDb({
  userSoundVolume,
  userMusicVolume,
  userLanguage,
})

const useUser = () => {
  const setSettingValue = (name: string, value: any) => {
    // const storageKey = USER_SETTINGS_MAP[name]
    // storageKey && sessionStorage.setItem(storageKey, value)
    switch (name) {
      case 'gameSound':
        userSoundVolume.value = value
        break
      case 'music':
        userMusicVolume.value = value
        break
      case 'language':
        userLanguage.value = value
        break
      default:
    }

    storeUser({
      userSoundVolume: +userSoundVolume.value,
      userMusicVolume: +userMusicVolume.value,
      userLanguage: userLanguage.value,
    })
  }

  return {
    userSoundVolume,
    userMusicVolume,
    userLanguage,
    setSettingValue,
  }
}

export default useUser
