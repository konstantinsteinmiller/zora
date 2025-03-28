import { ZORA_TOTAL_LOAD_SIZE_NAME } from '@/utils/constants.ts'
import $ from '@/global'
import { convertToReadableSize } from '@/utils/function.ts'
import { ref, type Ref } from 'vue'

const currentOverallSize = 28889837
let singleton: any = null
const FileLoader = () => {
  if (singleton !== null) return singleton

  singleton = {}

  // Map to store progress per file, keyed by URL.
  let fileProgressMap: Record<string, { loaded: number; total: number }> = {}

  // Total bytes across all files (set when progress events arrive)
  let overallTotal = +localStorage[ZORA_TOTAL_LOAD_SIZE_NAME] || currentOverallSize || 0
  let totalLoaded = 0
  const isKnowingTotal = overallTotal > 0

  const currentlyLoadedPercent: Ref<number> = ref(0)
  const isLoading: Ref<boolean> = ref(true)
  singleton = { backUpTotal: 0, currentlyLoadedPercent, isLoading }

  singleton.clearData = () => {
    fileProgressMap = {}
    overallTotal = 0
    totalLoaded = 0
    isLoading.value = true
    currentlyLoadedPercent.value = 0
  }

  // Called on each file's progress event.
  singleton.onFileProgress = (url: string, event: ProgressEvent<EventTarget>) => {
    // If total is not recorded yet, record it.
    if (!fileProgressMap[url]) {
      fileProgressMap[url] = { loaded: 0, total: event.total }
    }
    /* add total when files is completely loaded */
    if (event.loaded === event.total) {
      if (!isKnowingTotal) overallTotal += event.total
      singleton.backUpTotal += event.total
      totalLoaded += event.loaded
    }
    fileProgressMap[url].loaded = event.loaded

    currentlyLoadedPercent.value = +(overallTotal > 0 ? (totalLoaded / overallTotal) * 100 : 0).toFixed(0)
    // console.log('currentlyLoadedPercent.value: ', currentlyLoadedPercent.value)
    // console.log(`Progress: ${current.value.toFixed(0)}%`)
  }

  singleton.loadData = (onFinished: () => void) => {
    $.loadingManager.onLoad = () => {
      const total = convertToReadableSize($.fileLoader.backUpTotal)
      console.log('%c All assets loaded', 'color: lightgrey', total)

      setTimeout(() => {
        isLoading.value = false
      }, 300)

      localStorage.setItem(ZORA_TOTAL_LOAD_SIZE_NAME, $.fileLoader.backUpTotal.toString())
      onFinished()
    }
  }

  $.fileLoader = singleton

  return singleton
}

export default FileLoader
