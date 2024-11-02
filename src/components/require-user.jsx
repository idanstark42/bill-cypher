import { useState } from 'react'

import { useUser } from '../helpers/user'
import EditableValue from './editable-value'

export default function RequireUser ({ children, force=false, message, onDone }) {
  const { user, setUser } = useUser()
  const [done, setDone] = useState(!(force || user === 'anonymous'))
  const [constantMessage] = useState(message || (user === 'anonymous' ? 'You must have a name to continue' : 'Is this your name?'))

  const finish = () => {
    setDone(true)
    if (onDone) {
      onDone()
    }
  }
  
  if (done) return children

  return <div className='require-user'>
    <div className='message'>{constantMessage}</div>
    <div className='actions'>
      <EditableValue name='user' control={[user, setUser]} />
      <div className='button' onClick={finish} disabled={user === 'anonymous'}>Continue</div>
    </div>
  </div>
}