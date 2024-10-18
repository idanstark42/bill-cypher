import { createWorker } from 'tesseract.js'

import { compressImage, MAX_FILE_SIZE } from './compress-image'

export default async function getWords (file) {
  if (file.size > MAX_FILE_SIZE) {
    file = await compressImage(file)
  }
  
  const ocrData = await getOCR(file)
  return ocrData.words.map(word => ({
    ...word,
    top: word.bbox.y0,
    left: word.bbox.x0,
    width: word.bbox.x1 - word.bbox.x0,
    height: word.bbox.y1 - word.bbox.y0,
    text: word.text
  }))
}

async function getOCR (file) {
  const worker = await createWorker('heb')
  const ret = await worker.recognize(file)
  const data = ret.data
  await worker.terminate()
  return data
}
