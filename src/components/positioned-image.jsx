import React, { useEffect, useRef, useState } from 'react'

export default function PositionedImage ({ item, imageURL }) {
  const [ratio, setRatio] = useState(1)
  const image = useRef(null)

  useEffect(() => {
    function processImage () {
      const img = document.querySelector('img')
      if (!img) {
        setTimeout(processImage, 500)
        return
      }
      const { naturalWidth } = img
      if (!naturalWidth) {
        setTimeout(processImage, 500)
        return
      }
      const { width } = image.current.getBoundingClientRect()
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
    backgroundSize: 'cover',
    // backgroundPositionX: ratio ? (-item.left * ratio + 5) : 0,
    backgroundPositionY: ratio ? (-item.top * ratio + 5) : 0,
    boxShadow: '0px 0px 3px 0.5px #403007',
  }} ref={image} />
}