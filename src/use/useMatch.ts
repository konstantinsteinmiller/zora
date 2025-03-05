import game from '@/Game.ts'
import { ref } from 'vue'
import type { Ref } from 'vue'

const isDebug = import.meta.env.VITE_DEBUG || !!sessionStorage.getItem('isDebug')

const isStartingGame: Ref<boolean> = ref(false)
const isFakeOnlineGame: Ref<boolean> = ref(false)
const isResizing: Ref<boolean> = ref(false)
const isSplashScreenVisible: Ref<boolean> = ref(true)
const showSplashScreen: Ref<boolean> = ref(true)
const isDbInitialized: Ref<boolean> = ref(false)

const controls: any = ref({
  show: false,
  isLeftMouseButton: true,
  isRightMouseButton: false,
  isTap: false,
  x: '0px',
  y: '0px',
})

const useMatch = () => {
  const resetMatch = () => {
    // if (game.enemyTeam.teamUuid !== 'NPC') {
    //   // this.registerForRandomMatch()
    //   /* Todo reset game for random match and for invite match */
    // } else {
    //   setPlayerTeam({ resource: 0, unitsList: null })
    //   setEnemyTeam({ resource: 0, unitsList: null })
    //   resetPlaceholderUnit()
    // }
  }

  return {
    resetMatch,
    isResizing,
    isFakeOnlineGame,
    isSplashScreenVisible,
    showSplashScreen,
    isDbInitialized,
    isStartingGame,
    controls,
    game,
  }
}

export default useMatch
