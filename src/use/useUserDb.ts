import type { Ref } from 'vue'
import useMatch from '@/use/useMatch'
import clonedeep from 'lodash.clonedeep'

const { isSplashScreenVisible, isDbInitialized } = useMatch()

let db: any

const useUserDb = ({
  userSoundVolume,
  userMusicVolume,
  userLanguage,
  userTutorialsDoneMap,
}: {
  userSoundVolume: Ref<number>
  userMusicVolume: Ref<number>
  userLanguage: Ref<string>
  userTutorialsDoneMap: Ref<string>
}) => {
  // Open our database; it is created if it doesn't already exist
  const request = window.indexedDB.open('user_db', 1)

  // error handler signifies that the database didn't open successfully
  request.addEventListener('error', () => console.error('Database failed to open'))

  // success handler signifies that the database opened successfully
  request.addEventListener('success', () => {
    // Store the opened database object in the db variable. This is used a lot below
    db = request.result
    init()
  })

  // Set up the database tables if this has not already been done
  request.addEventListener('upgradeneeded', (e: any) => {
    // Grab a reference to the opened database
    const db = e.target.result

    // Create an objectStore to store our videos in (basically like a single table)
    // including a auto-incrementing key
    const objectStore = db.createObjectStore('user_os', { keyPath: 'name' })

    // Define what data items the objectStore will contain
    objectStore.createIndex('userSoundVolume', 'userSoundVolume', { unique: false })
    objectStore.createIndex('userMusicVolume', 'userMusicVolume', { unique: false })
    objectStore.createIndex('userLanguage', 'userLanguage', { unique: false })
    objectStore.createIndex('userTutorialsDoneMap', 'userTutorialsDoneMap', { unique: false })
    // console.log('Database setup complete')
  })

  function init() {
    // Open transaction, get object store, and get() each video by name
    const objectStore = db.transaction('user_os').objectStore('user_os')
    const request = objectStore.get('user')
    request.addEventListener('success', () => {
      // If the result exists in the database (is not undefined)
      // console.log('request.result: ', request.result)
      if (request.result) {
        userSoundVolume.value = request.result.userSoundVolume
        userMusicVolume.value = request.result.userMusicVolume
        userLanguage.value = request.result.userLanguage
        if (request.result.userTutorialsDoneMap) {
          userTutorialsDoneMap.value = JSON.parse(request.result.userTutorialsDoneMap)
        }
      } else {
        storeUser({
          userSoundVolume: userSoundVolume.value,
          userMusicVolume: userMusicVolume.value,
          userLanguage: userLanguage.value,
          userTutorialsDoneMap: userTutorialsDoneMap.value,
        })
      }
      isDbInitialized.value = true

      setTimeout(() => {
        isSplashScreenVisible.value = false
      }, 300)
    })
    request.addEventListener('error', () => {
      isSplashScreenVisible.value = false
    })
  }

  // Define the storeUser() function
  function storeUser(params: any) {
    const store = db.transaction(['user_os'], 'readwrite').objectStore('user_os')

    if (Object.keys(params.userTutorialsDoneMap)?.length) {
      const clone = clonedeep(params.userTutorialsDoneMap)
      params.userTutorialsDoneMap = JSON.stringify(clone)
    }
    if (params.userTutorialsDoneMap?.value && Object.keys(params.userTutorialsDoneMap?.value)?.length) {
      const clone = clonedeep(params.userTutorialsDoneMap?.value)
      params.userTutorialsDoneMap = JSON.stringify(clone)
    }

    const record = {
      name: 'user',
      ...params,
      // userTutorialsDoneMap: JSON.stringify(params.userTutorialsDoneMap),
    }
    const request = store.put(record)

    // request.addEventListener('success', () => console.log('Record update attempt finished'))
    request.addEventListener('error', () => console.error(request.error))
  }

  return { storeUser }
}

export default useUserDb
