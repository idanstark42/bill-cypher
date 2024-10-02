import React, { useState, useEffect } from 'react'
import { FaCamera, FaCheck, FaTimes, FaEquals, FaMinus, FaPlus, FaPercent, FaRegTrashAlt } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'

import { useForceUpdate } from '../helpers/force-update'
import Loader from '../components/loader'
import getWords from '../helpers/ocr'
import Session from '../helpers/session'
import { uploadImage } from '../helpers/backend'

const TOOLS = {
  toggle: { icon: <FaRegTrashAlt />, class: 'disabled' },
  total: { icon: <FaEquals />, class: 'total' },
  discount: { icon: [<FaMinus />,<FaPercent />], class: 'discount' },
  tip: { icon: [<FaPlus />,<FaPercent />], class: 'tip' },
}

export default function Init () {
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [words, setWords] = useState([])
  const [heightRatio, setHeightRatio] = useState(1)
  const [widthRatio, setWidthRatio] = useState(1)
  const [selectedTool, selectTool] = useState('toggle')
  const forceUpdate = useForceUpdate()

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
    const sessionProperties = {
      numbers: words.filter(word => !Boolean(word.class)),
      image: imageURL,
      compressedImage: compressedImageURL,
      people: []
    }
    if (words.find(word => word.class === 'total')) {
      sessionProperties.total = words.find(word => word.class === 'total')
    }
    if (words.find(word => word.class === 'discount')) {
      sessionProperties.discounts = words.filter(word => word.class === 'discount')
    }
    if (words.find(word => word.class === 'tip')) {
      sessionProperties.tips = words.filter(word => word.class === 'tip')
    }
    const newSession = await Session.create(sessionProperties)
    window.location.href = `${window.location.origin}/participate/${newSession.id}`
  }

  const toggleTool = word => {
    const tool = TOOLS[selectedTool]
    if (!tool) return

    if (word.class === tool.class) {
      delete word.class
    } else {
      word.class = tool.class
    }
    forceUpdate()
  }

  let content = undefined

  if (image) {
    content = [
      <div className='image-display' key='image-display'>
        <img src={image} alt="display" id='image' />
        {words.map((word, index) => <div key={index} className={`number ${word.class || ''}`} onClick={() => toggleTool(word)} style={{
          top: word.top * heightRatio - 2,
          left: word.left * widthRatio - 2,
          width: word.width * widthRatio + 4,
          height: word.height * heightRatio + 4
        }} value={word.value}></div>)}
        <div className='tool-bar'>
          {Object.entries(TOOLS).map(([tool, config]) => <div key={tool} className={`tool blue button ${selectedTool === tool ? 'selected' : ''}`} onClick={() => selectTool(tool)}>
            {config.icon}
          </div>)}
        </div>
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