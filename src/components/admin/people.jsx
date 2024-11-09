import { useState } from 'react'
import { FaChartPie, FaDollarSign, FaPercent, FaTrash } from 'react-icons/fa'

import EditableValue from '../editable-value'

import { randomName } from '../../helpers/person'

export default function People ({ session, setView, enabled }) {
  const [loadingAddPerson, setLoadingAddPerson] = useState(false)
  
  if (!enabled || !session) return ''

  const addPerson = async () => {
    setLoadingAddPerson(true)
    await session.fullUpdate({ $addToSet: { 'data.participants': { name: randomName(), id: Math.random().toString(36).substring(2, 15) } } })
    setLoadingAddPerson(false)
  }

  console.log(session.people)
  
  return <>
    <div className='list'>
      {session.people.map(person => <Person person={person} session={session} key={person.id} />)}
      <div className={`person card ${loadingAddPerson ? 'loading' : ''}`}
        onClick={addPerson}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', height: '2rem', color: '#f0d07d', fontSize: '2rem', backgroundColor: 'black', border: '2px solid #f0d07d' }}>
        {loadingAddPerson ? '' : 'ADD PERSON'}
      </div>
    </div>
    <img src={session.data.image} alt='people' style={{ display: 'none' }} />
  </>
}

function Person ({ person, session }) {
  const [loadingName, setLoadingName] = useState(false)
  const [loadingRemoval, setLoadingRemoval] = useState(false)
  const items = person.items

  const rename = async name => {
    setLoadingName(true)
    const newParticipants = session.data.participants.map(p => p.id === person.id ? { ...p, name } : p)
    await session.fullUpdate({ $set: { 'data.participants': newParticipants } })
    setLoadingName(false)
  }

  const removePerson = async () => {
    setLoadingRemoval(true)
    await session.fullUpdate({ $pull: { 'data.participants': { id: person.id } } })
    setLoadingRemoval(false)
  }
  
  return <div className={`person card ${loadingRemoval ? 'loading' : ''}`} style={{ gridTemplateRows: `2rem 2rem repeat(${items.length+1}, 1rem)` }}>
    {loadingRemoval ? '' : <>{loadingName ? <div>...</div> : <div className='text' style={{ gridColumn: '1 / 4', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', height: '2rem', textAlign: 'left' }}>
      <EditableValue control={[person.name, name => rename(name)]} style={{ width: '100%', minWidth: 'unset' }} inputStyle={{ width: '7rem' }} />
    </div>}
    <div className='text' style={{ gridColumn: '4 / 6', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 'bold', height: '2rem' }}>
      Total: {session._priceAfterAdditions(person.total).toFixed(2)}
    </div>
    {items.length === 0 ? <div style={{ gridArea: '2 / 1 / 6 / 6', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', gap: '1rem' }}>
      <div>No items</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }} onClick={removePerson}>
      <FaTrash />remove person
      </div>
    </div> :
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>item</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaDollarSign /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaPercent /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaChartPie /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>final</div>
      {items.map(item => <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.value.toFixed(2)}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.priceOf(person).toFixed(2)}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.percentOf(person).toFixed(0)}%</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.sharesOf(person).toFixed(0)}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{session._priceAfterAdditions(item.priceOf(person)).toFixed(2)}</div>
      </>)}
    </>}</>}
  </div>
}