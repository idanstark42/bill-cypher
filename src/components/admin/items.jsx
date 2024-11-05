import { useState } from 'react'
import { FaChartPie, FaDollarSign, FaPercent, FaPlus, FaTrash } from 'react-icons/fa'
import PositionedImage from '../positioned-image'

export default function Items ({ session, setView, enabled }) {
  
  if (!enabled || !session) return ''
  
  return <>
    <div className='list'>
      {session.items.map((item, index) => <Item item={item} session={session} key={index} />)}
    </div>
    <img src={session.data.image} alt='people' style={{ display: 'none' }} />
  </>
}

function Item ({ item, session }) {
  const tools = [
    { name: 'price', icon: <FaDollarSign /> },
    { name: 'percent', icon: <FaPercent /> },
    { name: 'shares', icon: <FaChartPie /> }
  ]
  const [tool, setTool] = useState('price')
  const [additionalPerson, setAdditionalPerson] = useState('')

  const addPerson = async () => {
    const people = session.people
    const person = people.find(person => person.name === additionalPerson) || people[Math.round(Math.random() * people.length)]
    await person.participate({ index: item.index })
  }

  const people = item.people

  return <div className='item card' style={{ gridTemplateRows: `2rem 2rem repeat(${people.length + 1}, 1.5rem)` }}>
    <PositionedImage item={item} imageURL={session.data.image} />
    {people.length === 0 ? <div className='text' style={{ gridArea: '2 / 1 / 5 / 5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
      No one has claimed this item yet
      <div className='button' style={{ margin: '1rem 0 0 0', height: '2rem', border: '2px solid black' }}
        onClick={addPerson}>Add someone</div>
    </div> : <>
      <div className='text' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontWeight: 'bold', height: '2rem' }}>
        participants
      </div>
      <div className='toolbar' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem' }}>
        {tools.map(t => <div style={{
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
      {people.map(person => <>
        <div className='person' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          {person.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {item[tool + 'Of'](person)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {Math.round(session._priceAfterAdditions(item.priceOf(person)) * 100) / 100}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <FaTrash onClick={() => person.unparticipate(item.id)} />
        </div>
      </>)}
      <div style={{ gridColumn: '1 / 5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input name='additional-person' type='text' value={additionalPerson} onChange={e => setAdditionalPerson(e.target.value)} />
        <FaPlus onClick={addPerson} />
      </div>
    </>
    }
  </div>
}