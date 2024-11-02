import EditableValue from './editable-value'
import { useUser } from '../helpers/user'

export default function User () {
  const [user, setUser] = useUser()

  return <div className='user' style={{ color: user === 'anonymous' ? 'red' : 'white' }}>
    <EditableValue name='user' control={[user, setUser]} style={{ flexDirection: 'row-reverse', minWidth: '5rem' }}/>
  </div>
}