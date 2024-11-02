import { useState, useEffect } from 'react'

import EditableValue from '../components/editable-value'
import User from '../components/user'

import { useUser } from '../helpers/user'
import useSession from '../helpers/use-session'

export default function Participate () {
  const [user, setUser] = useUser()
  const [selectedNumbers, setSelectedNumbers] = useState([])
  const [widthRatio, setWidthRatio] = useState(1)
  const [heightRatio, setHeightRatio] = useState(1)
  const session = useSession()

  useEffect(() => {
    const processImage = () => {
      setTimeout(() => {
        const image = document.getElementById('image')
        if (!image) {
          processImage()
          return
        }

        const { width, height } = image.getBoundingClientRect()
        const { naturalWidth, naturalHeight } = image

        setWidthRatio(width / naturalWidth)
        setHeightRatio(height / naturalHeight)
      }, 500)
    }

    processImage()
  }, [session])

  const toggleNumber = index => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(i => i !== index))
    } else {
      setSelectedNumbers([...selectedNumbers, index])
    }
  }

  const selected = index => selectedNumbers.includes(index)

  const submit = async () => {
    // TODO: Implement
  }

  if (!session) return <></>

  const { numbers, image, selectedNumbers: relevantNumbers } = session.data

  return <div className='participate'>
    <div className='top-bar'>
      <div className='text'>PARTICIPATE</div>
      <User />
    </div>
    <div className='content'>
      <div className='image-display' style={{ height: 'calc(100% - 6rem)' }}>
        <img src={image} alt="display" id='image' />
        {numbers.filter((number, index) => relevantNumbers.includes(index)).map((number, index) => <div key={index} className={`number ${selected(index) ? 'selected' : ''}`}
          onMouseUp={() => toggleNumber(index)}
          style={{
            top: number.top * heightRatio - 2,
            left: number.left * widthRatio - 2,
            width: number.width * widthRatio + 4,
            height: number.height * heightRatio + 4
          }} value={number.value}></div>)}
      </div>
      <div className='text'>
        Select the items you participated in
      </div>
      <div className='text'>
        Total: {session.personalTotal(user)}
      </div>
      <div className='buttons'>
        <div className='yellow button' onClick={submit}>Submit</div>
      </div>
    </div>
  </div>
}
