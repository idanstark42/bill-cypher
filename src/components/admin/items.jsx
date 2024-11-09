import React, { useState } from 'react'
import { FaChartPie, FaDollarSign, FaPercent, FaUndo, FaPlus, FaTrash } from 'react-icons/fa'
import PositionedImage from '../positioned-image'
import EditableValue from '../editable-value'

export default function Items ({ session, setView, enabled }) {
  
  if (!enabled || !session) return ''
  
  return <>
    <div className='list'>
      {session.items.map((item, index) => <Item item={item} session={session} key={index} setView={setView} />)}
    </div>
    <img src={session.data.image} alt='people' style={{ display: 'none' }} />
  </>
}

function Item ({ item, session, setView }) {
  const tools = [
    { name: 'price', icon: <FaDollarSign /> },
    { name: 'percent', icon: <FaPercent /> },
    { name: 'shares', icon: <FaChartPie /> }
  ]
  const [tool, setTool] = useState('price')
  const [loadingPersonAddition, setLoadingPersonAddition] = useState(false)
  const [additionalPerson, setAdditionalPerson] = useState('')
  const [loadingDivision, setLoadingDivision] = useState(false)

  const addPerson = async () => {
    setLoadingDivision(true)
    setLoadingPersonAddition(true)
    const people = session.people
    const person = people.find(person => person.name === additionalPerson)
    await person.participate({ index: item.index })
    setAdditionalPerson('')
    setLoadingPersonAddition(false)
    setLoadingDivision(false)
  }

  const setByTool = async (value, person) => {
    setLoadingDivision(true)
    item[`set${tool[0].toUpperCase()}${tool.slice(1)}Of`](person, Number(value))
    item.flush()
    await session.fullUpdate({ $set: { 'data.participations': session.participations } })
    setLoadingDivision(false)
  }

  const reset = async person => {
    setLoadingDivision(true)
    item.reset(person, tool)
    item.flush()
    await session.fullUpdate({ $set: { 'data.participations': session.participations } })
    setLoadingDivision(false)
  }

  const people = item.people
  const editable = item.isEditableBy(tool)
  const nonParticipating = session.people.filter(person => !person.participates(item))

  return <div className='item card' style={{ gridTemplateRows: `2rem 2rem repeat(${people.length + 1}, 1.5rem)` }}>
    <PositionedImage item={item} imageURL={session.data.image} />
    {people.length === 0 ?
      <div className='text' style={{ gridArea: '2 / 1 / 5 / 5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
        No one has claimed this item yet
      </div> :
    <>
      <div className='text' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', height: '2rem' }}>
        participants
      </div>
      <div className='toolbar' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {tools.map(t => <div key={t.name} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', borderRadius: '50%', padding: '0.1rem', boxSizing: 'border-box',
          height: '1.2rem', width: '1.2rem',
          backgroundColor: t.name === tool ? 'black' : '',
          color: t.name === tool ? '#f0d07d' : 'black'
        }}
        onClick={() => setTool(t.name)}>
          {t.icon}
        </div>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
        final
      </div>
      <div>
      </div>
      {people.map(person => <React.Fragment key={person.id}>
        <div className='person' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          {person.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loadingDivision ? '...' :
          (editable ?
            <EditableValue
              name={person}
              control={[item[tool + 'Of'](person).toFixed(2), value => setByTool(value, person)]}
              style={{ minWidth: 'unset' }}
              inputStyle={{ width: '3rem' }}
            /> :
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 0.8rem)' }}>
            {item[tool + 'Of'](person).toFixed(2)}
            {item.isResettable(person, tool) ? <FaUndo onClick={() => reset(person)}/> : ''}
          </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loadingDivision ? '...' : session.priceAfterAdditions(item.priceOf(person)).toFixed(2)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <FaTrash onClick={() => person.unparticipate(item.index)} />
        </div>
      </React.Fragment>)}
    </>}
    {loadingPersonAddition ? '...' : 
      <div style={{ gridColumn: '1 / 5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        {nonParticipating.length === 0 ?
          <div style={{ flex: 1, fontSize: '0.8rem', textAlign: 'center', paddingTop: '0.5rem' }}>
            Everyone are participating &nbsp;
            <span onClick={() => setView('people')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>add more people</span>
          </div> :
          <>
            <select name='additional-person' value={additionalPerson} onChange={e => setAdditionalPerson(e.target.value)} style={{ flex: 1 }}>
              <option value=''>Add someone</option>
              {nonParticipating.map(person => <option key={person.id} value={person.name}>{person.name}</option>)}
            </select>
            <FaPlus onClick={addPerson} />
          </>
        }
      </div>
    }
  </div>
}