import { useState, useEffect } from 'react'

import Dashboard from '../components/admin/dashboard'
import User from '../components/user'
import useSession from '../helpers/use-session'

export default function Admin () {
  const session = useSession()
  const [currentView, setView] = useState('dashboard')

  const VIEWS = {
    dashboard: Dashboard
  }

  if (!session) return <></>

  return <>
    <div className='top-bar'>
      <div className='text'>ADMIN</div>
      <User />
    </div>
    {Object.entries(VIEWS).map(([key, View]) => <View session={session} setView={setView} enabled={currentView === key} />)}
    <div className='bottom-bar'>
      <div className='button' onClick={() => setView('items')}>Items</div>
      <div className='button' onClick={() => setView('dashboard')}>Dashboard</div>
      <div className='button' onClick={() => setView('people')}>People</div>
    </div>
  </>
}