import { useState } from 'react'
import PositionedImage from '../positioned-image'

import { randomName } from '../../helpers/person'

export default function People ({ session, setView, enabled }) {
  
  if (!enabled || !session) return ''

  const addPerson = async () => {
    await session.update({ $addToSet: { 'data.participants': { name: randomName() } } })
  }
  
  return <>
    <div className='list'>
      {session.people.map(person => <Person person={person} session={session} key={person.id} />)}
      <div className='person card'
        onClick={addPerson}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', height: '2rem', color: '#f0d07d', fontSize: '2rem', background: 'black', border: '2px solid #f0d07d' }}>
        ADD PERSON
      </div>
    </div>
    <img src={session.data.image} alt='people' style={{ display: 'none' }} />
  </>
}

function Person ({ person, session }) {
  const items = person.items
  
  return <div className='person card' style={{ gridTemplateRows: `2rem 2rem repeat(${items.length}, 1.5rem)` }}>
    <div className='text' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', height: '2rem' }}>
      {person.name}
    </div>
    {items.length === 0 ? <div style={{ gridArea: '2 / 1 / 5 / 5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
      No items
    </div> :
    items.map(item => <div className='item' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
      <PositionedImage item={item} imageURL={session.data.image} />
    </div>)}
  </div>
}