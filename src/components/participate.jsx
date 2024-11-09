import { useState, useEffect } from 'react'

import { useUser } from '../helpers/user'
import { useSession } from '../helpers/use-session'
import { useLoading } from '../helpers/use-loading'

export default function Participate ({ enabled=true }) {
  const [loading, setLoading] = useState(false)
  const { user, userId } = useUser()
  const { whileLoading } = useLoading()
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

        if (!naturalWidth || !naturalHeight) {
          processImage()
          return
        }

        setWidthRatio(width / naturalWidth)
        setHeightRatio(height / naturalHeight)
      }, 500)
    }

    processImage()

    const processSession = async () => {
      if (!session) return
      if (!session.user) await session.loginAs({ name: user, id: userId })
        setSelectedNumbers(session.user.participations.map(participation => participation.item))

      session.onUpdated(() =>{ 
        setLoading(true)
        setLoading(false)
      })
    }

    processSession()
  }, [session])

  useEffect(() => {
    (async () => {
      if (!session) return
      setLoading(true)
      const currentPerson = session.user
      const preexistingNumbers = currentPerson.participations.map(participation => participation.item)
      const numbersToAdd = selectedNumbers.filter(index => !preexistingNumbers.includes(index))
      const numbersToRemove = preexistingNumbers.filter(index => !selectedNumbers.includes(index))
      for (const number of numbersToAdd) {
        await currentPerson.participate({ index: number })
      }
      for (const number of numbersToRemove) {
        await currentPerson.unparticipate({ index: number })
      }
      setLoading(false)
    })()
  }, [selectedNumbers])
  const toggleNumber = index => {
    if (selectedNumbers.includes(index)) {
      setSelectedNumbers(selectedNumbers.filter(i => i !== index))
    } else {
      setSelectedNumbers([...selectedNumbers, index])
    }
  }

  const selected = index => selectedNumbers.includes(index)

  if (!enabled || !session) return <></>

  const { numbers, image, selectedNumbers: relevantNumbers } = session.data

  return <div className='participate'>
    <div className='image-display'>
      <img src={image} alt="display" id='image' />
      {numbers.map((number, index) => !relevantNumbers.includes(index) ? '' : <div key={index} className={`number ${selected(index) ? 'selected' : ''}`}
        onMouseUp={() => toggleNumber(index)}
        style={{
          top: number.top * heightRatio - 2,
          left: number.left * widthRatio - 2,
          width: number.width * widthRatio + 4,
          height: number.height * heightRatio + 4
        }} value={number.value}></div>)}
    </div>
    <div className='text'>
      Total: {loading ? '...' : session.user?.total}
    </div>
  </div>
}
