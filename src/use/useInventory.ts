import $ from '@/global.ts'
import useMessage from '@/use/useMessage.ts'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

let singleton: any

const useInventory = () => {
  if (singleton) return singleton

  const { addMessage } = useMessage()

  const inventoryMap = ref<Map<string, number>>(new Map())

  const addItem = (itemId: string, quantity: number, entity: any = $.player) => {
    const invMap = entity.inventory.inventoryMap.value
    if (invMap.has(itemId)) {
      invMap.set(itemId, invMap.get(itemId) + quantity)
      /* FIX ME: get item name to display it in the message */
      const itemName = 'fairy dust'
      addMessage(`${quantity} ${itemName}`, 4000)
    } else {
      invMap.set(itemId, quantity)
    }
  }

  const removeItem = (itemId: string, quantity: number, entity: any = $.player) => {
    const invMap = entity.inventory.inventoryMap.value
    if (invMap.has(itemId) && invMap.get(itemId) >= quantity) {
      invMap.set(itemId, invMap.get(itemId) - quantity)
      /* FIX ME: get item name to display it in the message */
      const itemName = 'fairy dust'
      addMessage(`-${quantity} ${itemName}`, 4000)
      return true
    } else {
      return false
    }
  }

  const hasItem = (itemId: string, quantity: number, entity: any = $.player) => {
    const invMap = entity.inventory.inventoryMap.value
    return invMap.has(itemId) && invMap.get(itemId) >= quantity
  }

  const addFairyDust = (quantity: number, entity: any = $.player) => {
    entity.currency.fairyDust += quantity
    addMessage(`${quantity} fairy dust`, 4000)
  }
  const removeFairyDust = (quantity: number, entity: any = $.player) => {
    if (quantity > entity.currency.fairyDust) {
      return false
    }
    entity.currency.fairyDust -= quantity
    addMessage(`-${quantity} fairy dust`, 4000)
    return true
  }

  const isPrimaryFairy = (name: number, entity: any = $.player) => {
    return entity.fairies?.fairiesList?.value?.[0]?.name === name
  }

  const tradeFairy = (giveAwayName: number, receiveFairy: number, entity: any = $.player) => {
    // const giveAwayFairy = entity.fairies?.getFairy?.(giveAwayName)
    // if (giveAwayFairy) {
    entity.fairies.fairiesList.value[0] = receiveFairy
    // }
    /* remove flying fairy mesh and replace with new fairy for more sophisticated demonstration */
    addMessage(`traded ${giveAwayName}, received ${receiveFairy.name}`, 5000)
    // console.log('entity.fairies.fairiesList.value[0]: ', entity.fairies.fairiesList.value[0])
    return
  }

  window.addFairyDust = addFairyDust
  window.removeFairyDust = removeFairyDust
  window.addItem = addItem
  window.removeItem = removeItem
  window.hasItem = hasItem
  window.isPrimaryFairy = isPrimaryFairy
  window.tradeFairy = tradeFairy

  return {
    addItem,
    removeItem,
    hasItem,
    addFairyDust,
    removeFairyDust,
    inventoryMap,
  }
}
export default useInventory
