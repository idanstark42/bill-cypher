import React, { useEffect, useState } from 'react'
import { FaDollarSign, FaUsers, FaChartPie } from 'react-icons/fa'
import { FaMoneyCheckDollar } from 'react-icons/fa6'

import RequireUser from '../components/require-user'
import Participate from '../components/participate'
import User from '../components/user'

import { useSession } from '../helpers/use-session'
import { useUser } from '../helpers/user'
import { useLoading } from '../helpers/use-loading'

export default function ParticipationPage () {
  const [done, setDone] = useState(false)
  const [showDetails, sethowDetails] = useState(false)
  const [loadingSession, setLoadingSession] = useState(false)
  const session = useSession()
  const { user, userId } = useUser()
  const { whileLoading } = useLoading()

  useEffect(() => {
    if (!session) return
    session.onUpdated(() => {
      setLoadingSession(true)
      setTimeout(() => setLoadingSession(false), 500)
    })
  }, [session])

  const loginToSession = () => {
    whileLoading(async () => await session.loginAs({ name: user, id: userId }))
  }

  if (!session) return <></>

  if (done) return <>
    <div className='participate' style={{ gap: '1rem' }}>
      <div className='top-bar'>
        <div className='text'>PARTICIPATE</div>
        <User />
      </div>
      <div className='content' style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, width: '100%' }}>
        <div className='big counter'>
          {loadingSession ? '...' : <>Total: {session.user.summary}</>}
        </div>
        {!showDetails ? '' : <div className={`details card ${loadingSession ? 'loading' : ''}`}>
          {loadingSession ? '': <div className='items' style={{ flexGrow: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: `repeat(${session.items.length + 2}, 2rem)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}><FaDollarSign /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaUsers /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaChartPie /></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}><FaMoneyCheckDollar /></div>
            {session.user.items.map(item => <React.Fragment key={item.index}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>{item.value.toFixed(2)}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.participations.length}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.priceOf(session.user).toFixed(2)}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{session.priceAfterAdditions(item.priceOf(session.user)).toFixed(2)}</div>
              </React.Fragment>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold' }}>Total</div>
            <div></div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{session.user.total}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 'bold' }}>{session.priceAfterAdditions(session.user.total)}</div>
          </div>}
        </div>}
      </div>
      <div className='buttons'>
        <div className='yellow button' onClick={() => setDone(false)}>Edit</div>
        <div className='empty yellow button' onClick={() => sethowDetails(true)} style={{ border: 'none', textDecoration: 'underline' }} >Details</div>
      </div>
    </div>
  </>

  return <RequireUser force message={`Join ${session.data.admin.name}'s bill as`} onDone={loginToSession}>
    <div className='participate' style={{ gap: 0 }}>
      <div className='top-bar'>
        <div className='text'>PARTICIPATE</div>
        <User />
      </div>
      <Participate />
      <div className='buttons'>
        <div className='yellow button' onClick={() => setDone(true)}>Done</div>
      </div>
    </div>
  </RequireUser>
}
