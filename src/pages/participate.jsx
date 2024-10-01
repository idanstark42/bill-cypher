import { useState, useEffect } from 'react'
import jsCookie from 'js-cookie'
import { FaShareAlt as FaShare } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'
import { FaPlay } from 'react-icons/fa'

import Session from '../helpers/session'
import EditableValue from '../components/editable-value'

export default function Participate () {
  const [session, setSession] = useState(null)
  const [widthRatio, setWidthRatio] = useState(1)
  const [heightRatio, setHeightRatio] = useState(1)
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState('')
  const [participations, setParticipations] = useState([])

  function updateName (value) {
    jsCookie.set('name', value)
    setName(value)
  }

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    setName(jsCookie.get('name') || '') 

    function processImage () {
      const img = document.querySelector('.fullscreen-image img')
      if (!img) {
        setTimeout(processImage, 500)
        return
      }
      const { naturalWidth, naturalHeight } = img
      if (!naturalWidth || !naturalHeight) {
        setTimeout(processImage, 500)
        return
      }
      const { width, height } = img.getBoundingClientRect()
      setWidthRatio(width / naturalWidth)
      setHeightRatio(height / naturalHeight)
    }

    const load = async () => {
      const session = await Session.load(id)
      setSession(session)

      setTimeout(processImage, 500)
    }
    load()
  }, [])

  function copyLink () {
    navigator.clipboard.writeText(session.shareURL)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  function participate (index) {
    if (!participations.some(participation => participation.index === index)) {
      setParticipations([...participations, { index, type: 'basic' }])
    } else {
      setParticipations(participations.filter(participation => participation.index !== index))
    }
  }

  async function next () {
    if (session.data.people.find(person => person.name === name)) {
      await session.update({ $set: { 'data.people.$[person].participations': participations } }, { arrayFilters: [{ 'person.name': name }] })
    } else {
      await session.update({ $push: { 'data.people': { name, participations } } })
    }
    // push into people array without removing the existing ones
    window.location.href = `${window.location.origin}/summary/${session.id}`
  }

  if (!session) return null

  return [
    <div className='fullscreen-image'>
      <img src={session.data.image} />
      {session.data.numbers.map((number, i) => (
        !(widthRatio === 1 || heightRatio === 1) && <div className={`number ${participations.some(participation => participation.index === i) ? 'participating' : ''}`} key={i} onClick={() => participate(i)} style={{
          top: number.top * heightRatio - 1,
          left: number.left * widthRatio - 1,
          width: number.width * widthRatio + 2,
          height: number.height * heightRatio + 2
        }}>
        </div>
      ))}
    </div>,
    <div className='buttons' key='buttons'>
      <EditableValue name='name' control={[name, updateName]} />
      <div className='yellow button' onClick={copyLink}>
        {copied ? <FaCheck /> : <FaShare />}
      </div>
      <div className='green button' onClick={next}>
        <FaPlay />
      </div>
    </div>
  ]
}