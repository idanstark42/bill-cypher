import React, { useState, useEffect } from 'react'
import { FaCamera, FaCheck } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'
import { FaTimes } from 'react-icons/fa'

import Loader from '../components/loader'
import getWords from '../helpers/ocr'
import Session from '../helpers/session'
import { uploadImage } from '../helpers/backend'

export default function Init () {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [words, setWords] = useState([])
  const [heightRatio, setHeightRatio] = useState(1)
  const [widthRatio, setWidthRatio] = useState(1)

  useEffect(() => setLoading(false), [])

  const handleImage = async e => {
    setLoading(true)
    setImageFile(e.target.files[0])
    const processImage = async () => {
      const img = document.getElementById('image')
      const { naturalWidth, naturalHeight } = img
      if (!naturalWidth || !naturalHeight) {
        setTimeout(processImage, 500)
        return
      }
      const { width, height } = img.getBoundingClientRect()
      setWidthRatio(width / naturalWidth)
      setHeightRatio(height / naturalHeight)

      const words = await getWords(e.target.files[0])
      const numbers = words.filter(word => !isNaN(word.text))
      numbers.forEach(number => { number.value = parseFloat(number.text) })
      setWords(numbers)
      setLoading(false)
    }

    const reader = new FileReader()
    reader.onload = e => setImage(e.target.result)
    reader.readAsDataURL(e.target.files[0])

    setTimeout(processImage, 500)
  }

  const clear = () => {
    setImage(null)
    setWords([])
  }

  const next = async () => {
    setLoading(true)
    const imageURL = await uploadImage(imageFile)
    const compressedImageURL = await uploadImage(imageFile, true)
    const newSession = await Session.create({ numbers: words, image: imageURL, compressedImage: compressedImageURL, people: [] })
    window.location.href = `${window.location.origin}/participate/${newSession.id}`
  }

  let content = undefined

  if (image) {
    content = [
      <div className='image-display' key='image-display'>
        <img src={image} alt="display" id='image' />
        {words.map((word, index) => <div key={index} className='number' style={{
          top: word.top * heightRatio - 2,
          left: word.left * widthRatio - 2,
          width: word.width * widthRatio + 4,
          height: word.height * heightRatio + 4
        }} value={word.value}></div>)}
      </div>,
      <div className='question' key='quesiton'>Did we find all relevant numbers?</div>,
      <div className='buttons' key='buttons'>
        <div className='red button' onClick={clear}>
          <FaTimes />
          <span>Retake</span>
        </div>
        <div className='green button' onClick={next} disabled={words.length === 0}>
          <FaCheck />
          <span>Approve</span>
        </div>
      </div>
    ]
  } else {
    content = [
      <input type='file' onChange={handleImage} capture='camera' accept='image/*' key='camera-input' />,
      <input type='file' onChange={handleImage}  key='select-input' />,
      <div className='image-display' style={{ display: 'none' }} key='image-display'>
        <img src={image} alt="display" id='image' />
      </div>,
      <div className='blue button' key='camera-button' onClick={() => document.querySelector('input[type="file"][capture]').click()}>
        <FaCamera />
        <span>Take picture</span>
      </div>,
      <div onClick={() => document.querySelector('input[type="file"]:not([capture])').click()} className='blue button' key='select-button'>
      <FiUpload />
      <span>Upload Image</span>
    </div>
    ]
  }

  return [<h2 className="title" key='title'>Bill Cypher</h2>,
    ...(loading ? [<Loader key='loader' />] : []),
    ...content
  ]
}