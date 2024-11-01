import { useEffect, useState } from 'react'
import cookie from 'js-cookie'

import EditableValue from './editable-value'

export default function User () {
  const [user, setUser] = useState('...')

  useEffect(() => {
    const user = cookie.get('user')
    setUser(user || 'anonymous')
  })

  const updateUser = async (newUser) => {
    cookie.set('user', newUser)
    setUser(newUser)
  }

  return <div className='user' style={{ color: user === 'anonymous' ? 'red' : 'white' }}>
    <EditableValue name='user' control={[user, updateUser]} style={{ flexDirection: 'row-reverse', minWidth: '5rem' }}/>
  </div>
}