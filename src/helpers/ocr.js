import { compressImage, MAX_FILE_SIZE } from './compress-image'

const OCR_SPACE_API_KEY = process.env.REACT_APP_OCR_SPACE_API_KEY

export default async function getWords (file) {
  // if the file size is larger then 1024 MB, the OCR API will not work
  // In that case we compress the image before sending it to the API
  if (file.size > MAX_FILE_SIZE) {
    file = await compressImage(file)
  }
  
  const ocrData = await getOCR(file)
  const words = []
  for (const region of ocrData.ParsedResults[0].TextOverlay.Lines) {
    for (const word of region.Words) {
      const { Left, Top, Width, Height, WordText } = word
      words.push({ top: Top, left: Left, width: Width, height: Height, text: WordText })
    }
  }
  return words
}

function getOCR (file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('isOverlayRequired', 'true')
  formData.append('OCREngine', '2')

  return fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      'apikey': OCR_SPACE_API_KEY
    },
    body: formData
  })
    .then(response => response.json())
    .catch(error => { console.error(error); return { ParsedResults: [] } })
}
