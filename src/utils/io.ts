export const saveDataToFile = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}
