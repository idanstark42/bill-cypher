import { useState, useEffect } from 'react'

import Session from '../helpers/session'

export default function Summary () {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      setSession(await Session.load(id))
    }
    load()
  }, [])

  if (!session) return null

  return session.payments.map(person => <div className='payment-card'>
    <div className='name'>{person.name}</div>
    <div className='total'>{person.total.toFixed(2)}</div>
    {person.items.map(item => [
      <div className='item' style={{
        backgroundImage: `url(${session.data.compressedImage})`,
        // not working after compression
        backgroundPositionX: -item.left - item.width - 30, backgroundPositionY: -item.top + 3
      }} />,
      <div className='price'>{item.value.toFixed(2)}</div>
    ])}
  </div>)
}