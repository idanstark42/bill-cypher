import { useState, useEffect } from 'react'
import { FaUser, FaShoppingCart } from 'react-icons/fa'

import Session from '../helpers/session'
import Items from '../components/items'
import People from '../components/people'

export default function Summary () {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('items')

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      setSession(await Session.load(id))
    }
    load()
  }, [])

  if (!session) return null

  return <div className='summary'>
    <div className='tabs'>
      <div className={`tab ${tab === 'items' ? 'yellow' : 'blue'} button`} onClick={() => setTab('items')}>
        <FaShoppingCart />
        <span>Items</span>
      </div>
      <div className={`tab ${tab === 'people' ? 'yellow' : 'blue'} button`} onClick={() => setTab('people')}>
        <FaUser />
        <span>People</span>
      </div>
    </div>
    <div className='content'>
      {tab === 'items' ? <Items session={session} /> : <People session={session} />}
    </div>
  </div>
}