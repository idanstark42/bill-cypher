import { useState, useEffect } from 'react'

import { FaUser, FaClipboard, FaList, FaUsers } from 'react-icons/fa'

import Dashboard from '../components/admin/dashboard'
import Participate from '../components/participate'
import User from '../components/user'
import useSession from '../helpers/use-session'
import { useUser } from '../helpers/user'

export default function Admin () {
  const session = useSession()
  const { userId } = useUser()
  const [currentView, setView] = useState('dashboard')

  useEffect(() => {
    if (!session) return
    if (session.data.admin.id !== userId) {
      window.location.href = window.location.href.replace('admin', 'participate')
    }
  }, [session, userId])

  const VIEWS = {
    dashboard: { Component: Dashboard },
    participate: { Component: Participate }
  }

  if (!session) return <></>

  return <>
    <div className='top-bar'>
      <div className='text'>ADMIN</div>
      <User />
    </div>
    {Object.entries(VIEWS).map(([key, { Component }]) => <Component session={session} setView={setView} enabled={currentView === key} />)}
    <div className='bottom-bar'>
      <div className='button' onClick={() => setView('participate')}><FaUser /></div>
      <div className='button' onClick={() => setView('items')}><FaList /></div>
      <div className='button' onClick={() => setView('dashboard')}><FaClipboard /></div>
      <div className='button' onClick={() => setView('people')}><FaUsers /></div>
    </div>
  </>
}