import { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

import EdiableValue from '../editable-value'

export default function Corrections ({ session, setSession, move, setLoading }) {
  const { numbers, widthRatio, heightRatio, image, selectedNumbers, additions } = session
  const activeNumbers = selectedNumbers.concat(Object.values(additions).flat()).filter(Boolean).map(index => ({ index, number: numbers[index] }))
  const [corrections, setCorrections] = useState(session.corrections || {})

  const setCorrection = (index, value) => {
    setCorrections(oldCorrections => ({ ...oldCorrections, [index]: Number(value) }))
  }

  const getCorrectValue = index => {
    if (corrections[index] === undefined) return numbers[index].value
    return corrections[index]
  }

  const finish = () => {
    move(1)
    setSession(oldSession => ({ ...oldSession, corrections }))
  }

  const back = () => {
    move(-1)
    setSession(oldSession => ({ ...oldSession, additions: [] }))
  }
  console.log(corrections)


  return [
    <div className='image-display' key='image-display'>
      <img src={image} alt="display" id='image' />
      {activeNumbers.map(({ index, number }) => <div key={index} className='number'
        style={{
          top: number.top * heightRatio - 2,
          left: number.left * widthRatio - 2,
          width: number.width * widthRatio + 4,
          height: number.height * heightRatio + 4
        }} value={corrections[index]}>
          <EdiableValue name='correction' control={[getCorrectValue(index), value => setCorrection(index, value)]} />
      </div>)}
    </div>,
    <div className='text' key='text'>
      Are any of these numbers wrong?
    </div>,
    <div className='buttons' key='buttons'>
      <div className='yellow button' onClick={back}>
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <div className='yellow button' onClick={finish} disabled={numbers.length === 0}>
        <span>Finish</span>
        <FaArrowRight />
      </div>
    </div>
  ]
}