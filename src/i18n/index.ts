import translations from '@/i18n/translations'
import spells from '@/i18n/spells'
import { mergeObjectsRecursive } from '@/utils/function.ts'

const mergeTranslations = () => {
  return mergeObjectsRecursive({}, mergeObjectsRecursive(spells, translations))
}
const messages = mergeTranslations()
export default messages
