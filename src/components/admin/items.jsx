import { useState } from 'react'
import { FaChartPie, FaDollarSign, FaPercent } from 'react-icons/fa'
import PositionedImage from '../positioned-image'

export default function Items ({ session, setView, enabled }) {
  
  if (!enabled || !session) return ''
  
  return <>
    <div className='list'>
      {session.items.map(item => <Item item={item} session={session} />)}
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

  const people = item.people

  return <div className='item card'>
    <PositionedImage item={item} imageURL={session.data.image} />
    {people.length === 0 ? <div className='text' style={{ gridColumn: '1 / 3', gridRow: '2 / 4', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
      No one has claimed this item yet
      <div className='button' style={{ margin: '1rem 0 0 0', height: '2rem', width: '10rem', border: '2px solid black' }}
        onClick={() => session.user.participate({ index: item.index })}>Claim</div>
    </div> : 
      <>
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
        <div className='text' style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {people.map(person => <div className='person'>
          {person.name}
        </div>)}
      </div>
      <div className='text' style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', height: '2rem' }}>
        {people.map(person => <div className='person' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div>{item[tool + 'Of'](person)}</div>
        </div>)}
      </div>
      </>
    }
    
  </div>
}