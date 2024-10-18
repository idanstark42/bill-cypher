import { useState } from 'react'

import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

export default function Select ({ session, setSession, move, setLoading }) {
  const { numbers, widthRatio, heightRatio, image } = session
  const [selectedNumbers, setSelectedNumbers] = useState([])

  const toggleNumber = index => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(i => i !== index))
    } else {
      setSelectedNumbers([...selectedNumbers, index])
    }
  }

  const selected = index => selectedNumbers.includes(index)

  const finish = () => {
    setSession(oldSession => ({ ...oldSession, selectedNumbers }))
    move(1)
  }

  const back = () => {
    setSession({})
    move(-1)
  }

  return [
    <div className='image-display' key='image-display'>
      <img src={image} alt="display" id='image' />
      {numbers.map((word, index) => <div key={index} className={`number ${selected(index) ? 'selected' : ''}`}
        onMouseUp={() => toggleNumber(index)}
        style={{
          top: word.top * heightRatio - 2,
          left: word.left * widthRatio - 2,
          width: word.width * widthRatio + 4,
          height: word.height * heightRatio + 4
        }} value={word.value}></div>)}
    </div>,
    <div className='text' key='text'>
      Select all the relevant numbers
    </div>,
    <div className='buttons' key='buttons'>
      <div className='yellow button' onClick={back}>
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <div className={`yellow button ${selectedNumbers.length > 0 ? '' : 'disabled'}`} onClick={finish} disabled={numbers.length === 0}>
        <span>Next</span>
        <FaArrowRight />
      </div>
    </div>
  ]
}