import React, { useEffect, useRef, useState } from 'react'

export default function PositionedImage ({ item, imageURL }) {
  const [ratio, setRatio] = useState(1)
  const [height, setHeight] = useState(0)
  const image = useRef(null)

  useEffect(() => {
    const img = document.querySelector('img')
    function processImage () {
      if (!img) {
        setTimeout(processImage, 500)
        return
      }
      const { naturalWidth } = img
      if (!naturalWidth) {
        setTimeout(processImage, 500)
        return
      }
      const { width, height } = image.current.getBoundingClientRect()
      setHeight(height)
      setRatio(width / naturalWidth)
    }

    setTimeout(processImage, 500)
  }, [])

  return <div className='image' style={{
    height: '2rem',
    flexGrow: 1,
    margin: 0,
    backgroundColor: 'black',
    backgroundImage: (ratio === 1) ? '' : `url(${imageURL})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: item.height / height * 90 + '%',
    backgroundPositionX: height ? (-item.left * item.height / height * 0.9 * ratio + 5) : 0,
    backgroundPositionY: height ? -item.top * item.height / height * 0.9 * ratio + height * 0.25 : 0,
    border: '1px solid black',
  }} ref={image} />
}