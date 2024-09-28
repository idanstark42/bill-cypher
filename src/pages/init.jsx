import React, { useState } from 'react'

import './App.scss'

const OCR_SPACE_API_KEY = '' // Get your own key from https://ocr.space/ocrapi

export default function Init () {
  const [image, setImage] = useState(null)

  function getOCR() {
    const file = document.getElementById('image').files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('isOverlayRequired', 'true')
    formData.append('OCREngine', '2')

    fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': OCR_SPACE_API_KEY
      },
      body: formData
    })
      .then(response => response.json())
      .then(data => { console.log(data) })
      .catch(error => { console.error(error) })
  }

  function fileChange (event) {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  return <div>
    <input type="file" id="image" allow="image/*" onChange={fileChange} />
    <button onClick={getOCR}>Get OCR</button>
    {image && <img src={image} alt="display" />}
  </div>
}
