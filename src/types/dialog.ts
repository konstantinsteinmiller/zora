export interface Option {
  id: string
  order: number
  text: string
  condition: () => boolean
  permanent: boolean
  important: boolean
  on: () => void
  onFinished?: () => void
}

export interface DialogLine {
  text: string
  speech: string
  type?: string
}
