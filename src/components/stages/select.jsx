import { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

import RequireUser from '../require-user'
import { useUser } from '../../helpers/user'

export default function Select ({ session, setSession, move, setLoading }) {
  const { numbers, widthRatio, heightRatio, image } = session
  const [selectedNumbers, setSelectedNumbers] = useState([])
  const { user, userId } = useUser()

  const toggleNumber = index => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(i => i !== index))
    } else {
      setSelectedNumbers([...selectedNumbers, index])
    }
  }

  const selected = index => selectedNumbers.includes(index)

  const finish = () => {
    move(1)
    setSession(oldSession => ({ ...oldSession, selectedNumbers, admin: { name: user, id: userId }, participants: [{ name: user, id: userId }] }))
  }

  const back = () => {
    move(-1)
    setSession({})
  }

  return <RequireUser>
    <div className='image-display'>
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
    <div className='text'>
      Select all the relevant numbers
    </div>
    <div className='buttons'>
      <div className='yellow button' onClick={back}>
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <div className={`yellow button ${selectedNumbers.length > 0 ? '' : 'disabled'}`} onClick={finish} disabled={numbers.length === 0}>
        <span>Next</span>
        <FaArrowRight />
      </div>
    </div>
  </RequireUser>
}