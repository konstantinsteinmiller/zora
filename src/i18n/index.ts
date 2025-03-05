import translations from '@/i18n/translations'
import { mergeObjectsRecursive } from '@/utils/function.ts'

const mergeTranslations = () => {
  return mergeObjectsRecursive({}, translations)
}
const messages = mergeTranslations()
export default messages
