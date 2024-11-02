import { useState } from 'react'
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

const TOOLS = ['total', 'tip', 'discount']

export default function Additions ({ session, setSession, move, setLoading }) {
  const { numbers, widthRatio, heightRatio, image, selectedNumbers } = session
  const [tool, setTool] = useState(TOOLS[0])
  const [additions, setAdditions] = useState(Object.fromEntries(TOOLS.map(name => [name, []])))

  const isActive = index => selectedNumbers.includes(index)

  const markings = index => (Object.entries(additions).find(([name, list]) => list.includes(index))?.[0] || '')

  const add = (index) => {
    setAdditions(oldAdditions => ({ ...oldAdditions, [tool]: [...(oldAdditions[tool]), index] }))
  }

  const remove = (index) => {
    setAdditions(oldAdditions => Object.fromEntries(TOOLS.map(name => [name, oldAdditions[name].filter(i => i !== index)])))
  }

  const toggle = (index) => {
    if (Object.values(additions).some(list => list.includes(index))) {
      remove(index)
    } else {
      add(index)
    }
  }

  const finish = () => {
    move(1)
    setSession(oldSession => ({ ...oldSession, additions }))
  }

  const back = () => {
    move(-1)
    setSession(oldSession => ({ ...oldSession, selectedNumbers: [] }))
  }

  return [
    <div className='image-display' key='image-display'>
      <img src={image} alt="display" id='image' />
      {numbers.map((word, index) => <div key={index} className={`number ${isActive(index) ? 'active' : ''} ${markings(index)}`}
        onMouseUp={() => toggle(index)}
        style={{
          top: word.top * heightRatio - 2,
          left: word.left * widthRatio - 2,
          width: word.width * widthRatio + 4,
          height: word.height * heightRatio + 4
        }} value={word.value}></div>)}
    </div>,
    <div className='text' key='text'>
      Are there any other details in the image?
    </div>,
    <div className='additions' key='additions'>
      {TOOLS.map((name, index) => <div key={index} className={`tool yellow button ${tool === name ? 'active' : ''}`} onClick={() => setTool(name)}>
        <span>{name}</span>
      </div>)}
    </div>,
    <div className='buttons' key='buttons'>
      <div className='yellow button' onClick={back}>
        <FaArrowLeft />
        <span>Back</span>
      </div>
      <div className='yellow button' onClick={finish} disabled={numbers.length === 0}>
        <span>Next</span>
        <FaArrowRight />
      </div>
    </div>
  ]
}