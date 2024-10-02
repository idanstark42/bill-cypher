export function compressImage (file) {
  console.log('compressing image. file size:', file.size)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, img.width, img.height)
        canvas.toBlob(blob => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', 0.5)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }).then(result => {
    console.log('compressed image. file size:', result.size)
    return result
  })
}

export const MAX_FILE_SIZE = 1024 * 1024