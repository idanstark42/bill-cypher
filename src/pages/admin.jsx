import { useState, useEffect } from 'react'

import Session from '../helpers/session'
import Loader from '../components/loader'

import Dashboard from '../components/admin/dashboard'
import User from '../components/user'

export default function Admin () {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [syncInterval, setSyncInterval] = useState(null)
  const [currentView, setView] = useState('dashboard')

  const VIEWS = {
    dashboard: Dashboard
  }

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      const session = await Session.load(id)
      setSession(session)
      setLoading(false)
    }

    load()
  }, [])

  useEffect(() => {
    if (session && !syncInterval) {
      setSyncInterval(setInterval(() => session.sync(), 5000))
    }
  }, [session, syncInterval])

  if (loading) return <Loader />

  console.log(Object.entries(VIEWS))

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