import { useState } from 'react'

import RequireUser from '../components/require-user'
import Participate from '../components/participate'
import User from '../components/user'

import useSession from '../helpers/use-session'
import { useUser } from '../helpers/user'
import { useLoading } from '../helpers/use-loading'

export default function ParticipationPage () {
  const [done, setDone] = useState(false)
  const [showDetails, sethowDetails] = useState(false)
  const session = useSession()
  const { user, userId } = useUser()
  const { whileLoading } = useLoading()  

  const loginToSession = () => {
    whileLoading(async () => await session.loginAs({ name: user, id: userId }))
  }

  if (!session) return <></>

  if (done) return <>
    <div className='participate' style={{ gap: 0 }}>
      <div className='top-bar'>
        <div className='text'>PARTICIPATE</div>
        <User />
      </div>
      <div className='big counter'>
        Total {session.user.total}
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
