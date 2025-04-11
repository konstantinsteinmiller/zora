import { ref, type Ref } from 'vue'

export interface Message {
  id: number
  message: string
  lifespan?: number
  timestamp: number
  paused: boolean
}

const messagesList: Ref<Message[]> = ref<Message[]>([])
let messageId = 0

export function useMessage() {
  const addMessage = (message: string, lifespan: number = 5000) => {
    if (!message) {
      console.error('Toast message cannot be empty')
      return
    }
    const newMessage: Message = {
      id: messageId++,
      message,
      lifespan,
      timestamp: Date.now(),
      paused: false,
    }
    messagesList.value.push(newMessage)
  }

  const removeMessage = (id: number) => {
    const index = messagesList.value.findIndex(message => message.id === id)
    if (index !== -1) {
      messagesList.value.splice(index, 1)
    }
  }

  return {
    messagesList,
    addMessage,
    removeMessage,
  }
}
export default useMessage
