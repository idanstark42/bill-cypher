import { useState, useEffect } from 'react'

import { FaCheck } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa'
import { FaEdit } from 'react-icons/fa'

export default function EditableValue ({ name, control }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = control
  const [tempValue, setTempValue] = useState(value)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  function startEditing () {
    setEditing(true)
  }

  function stopEditing (save) {
    setEditing(false)
    if (save) setValue(tempValue)
  }

  function input () {
    return <div className='editing-value'>
      <input name={name} type='text' value={tempValue} onChange={e => setTempValue(e.target.value)} autoFocus />
      <div onClick={() => stopEditing(true)}><FaCheck /></div>
      <div onClick={() => setEditing(false)}><FaTimes /></div>
    </div>
  }

  function closed () {
    return <div className='editing-value' onClick={startEditing}><span>{value || name}</span><FaEdit style={{ marginLeft: '0.5rem' }} /></div>
  }

  return editing ? input() : closed()
}