import { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

import EdiableValue from '../editable-value'

export default function Corrections ({ session, setSession, move, setLoading }) {
  const { numbers, widthRatio, heightRatio, image, selectedNumbers, ...tools } = session
  const activeNumbers = selectedNumbers.map(index => numbers[index])
  const toolNumbers = numbers.filter((_, index) => Object.values(tools).flat().includes(index))
  const [corrections, setCorrections] = useState(session.corrections || activeNumbers.map(word => word.value).concat(toolNumbers.map(word => word.value)))

  const setCorrection = (index, value) => {
    const newCorrections = [...corrections]
    newCorrections[index] = value
    setCorrections(newCorrections)
  }

  const finish = () => {
    for (let i = 0; i < activeNumbers.length; i++) {
      activeNumbers[i].originalValue = activeNumbers[i].value
      activeNumbers[i].value = corrections[i]
    }
    setSession(oldSession => ({ ...oldSession, numbers, corrections }))
    move(1)
  }

  const back = () => {
    setSession(oldSession => ({ ...oldSession, selectedNumbers: [] }))
    move(-1)
  }

  return [
    <div className='image-display' key='image-display'>
      <img src={image} alt="display" id='image' />
      {activeNumbers.map((word, index) => <div key={index} className='number'
        style={{
          top: word.top * heightRatio - 2,
          left: word.left * widthRatio - 2,
          width: word.width * widthRatio + 4,
          height: word.height * heightRatio + 4
        }} value={corrections[index]}>
          <EdiableValue name='correction' control={[corrections[index], value => setCorrection(index, value)]} />
        </div>)}
        {toolNumbers.map((word, index) => <div key={index} className='number'
        style={{
          top: word.top * heightRatio - 2,
          left: word.left * widthRatio - 2,
          width: word.width * widthRatio + 4,
          height: word.height * heightRatio + 4
        }} value={corrections[activeNumbers.length + index]}>
          <EdiableValue name='correction' control={[corrections[activeNumbers.length + index], value => setCorrection(activeNumbers.length + index, value)]} />
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