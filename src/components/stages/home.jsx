import React, { useEffect, useState } from 'react'
import { FaCamera } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'

import getWords from '../../helpers/ocr'
import { uploadImage } from '../../helpers/backend'

export default function Home   ({ session, setSession, move, setLoading }) {
  const [image, setImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  const handleImage = async e => {
    setLoading(true)
    setImageFile(e.target.files[0])

    const reader = new FileReader()
    reader.onload = e => setImage(e.target.result)
    reader.readAsDataURL(e.target.files[0])
  }

  useEffect(() => {
    const processImage = async () => {
      if (!image) {
        setTimeout(processImage, 500)
        return
      }
  
      const img = document.getElementById('image')
      const { naturalWidth, naturalHeight } = img
      if (!naturalWidth || !naturalHeight) {
        setTimeout(processImage, 500)
        return
      }
      const { width, height } = img.getBoundingClientRect()
      const numbers = (await getWords(imageFile)).filter(word => word.is_numeric)
      numbers.forEach(number => {
        number.value = parseFloat(number.text.match(/\d+/)[0])
        delete number.page
        delete number.text
        delete number.is_numeric
        delete number.block
        delete number.line
        delete number.paragraph
        delete number.baseline
      })
      setSession(oldSession => ({
        ...oldSession,
        numbers,
        widthRatio: width / naturalWidth,
        heightRatio: height / naturalHeight,
        imageFile
      }))
      setLoading(false)
      move(1)
    }

    const createImageURL = async () => {
      const url = await uploadImage(imageFile)
      setSession(oldSession => ({ ...oldSession, image: url }))
    }

    if (!image) return
    
    processImage()
    createImageURL()
  }, [image]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>
    <h2 className='title'>Bill Cypher</h2>
    <div className='text' style={{ fontSize: '1.5rem' }}>start decyphering a bill by</div>
    <input type='file' onChange={handleImage} capture='camera' accept='image/*' />
    <input type='file' onChange={handleImage}  />
    <div className='image-display' style={{ position: 'absolute', zIndex: -1, opacity: 0 }}>
      <img src={image || ''} alt="display" id='image' />
    </div>
    <div className='yellow button' onClick={() => document.querySelector('input[type="file"][capture]').click()}>
      <FaCamera />
      <span>Taking its picture</span>
    </div>
    <div onClick={() => document.querySelector('input[type="file"]:not([capture])').click()} className='yellow button'>
      <FiUpload />
      <span>uploading its picture</span>
    </div>
  </>
}