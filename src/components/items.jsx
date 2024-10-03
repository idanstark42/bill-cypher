import React, { useState } from 'react'
import { FaArrowRight, FaHashtag, FaPercentage, FaChartPie } from 'react-icons/fa'
import PositionedImage from './positioned-image'

export default function Items ({ session }) {
  return <div className='items cards'>
    <img src={session.data.image} alt='items' style={{ display: 'none' }} />
    {session.items.map((item, index) => <Item key={index} item={item} session={session} />)}
  </div>
}

const DISPLAYS = {
  number: { Icon: FaHashtag, show: (item, person) => item.priceOf(person) },
  percentage: { Icon: FaPercentage, show: (item, person) => item.percentOf(person) + '%' },
  shares: { Icon: FaChartPie, show: (item, person) => item.sharesOf(person) }
}

function Item ({ item, session }) {
  const [display, setDisplay] = useState('number')
  console.log(item)

  return <div className='item card'>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
      <div className='price' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontWeight: 'bold' }}>{item.value.toFixed(2)}</div>
        {session.discount ? <div className='discount'>-{session.discount.toFixed(2)}%</div> : ''}
        {session.tip ? <div className='tip'>+{session.tip.toFixed(2)}%</div> : ''}
        <div className='final-value' style={{ fontWeight: 'bold' }}>{session.finalValue(item.value).toFixed(2)}</div>
      </div>
      <PositionedImage item={item} imageURL={session.data.image} />
    </div>
    <div className='paying-title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
      <div style={{ fontWeight: 'bold', flexGrow: 1 }}>paying</div>
      <div className='side-buttons' style={{ display: 'flex', gap: '0.5rem', flexGrow: 5 }}>
        {Object.entries(DISPLAYS).map(([key, { Icon }]) => <Icon key={key} onClick={() => setDisplay(key)} style={{ cursor: 'pointer', ...(display === key ? { color: '#368181' } : {}) }} />)}
      </div>
    </div>
    <div className='participations'>
      {item.participations.map((person, index) => [
        <div className='name' key={`name ${index}`}>{person.name}</div>,
        <div className='price' key={`price ${index}`}>{DISPLAYS[display].show(item, person)}</div>,
        <span key={`arrow ${index}`}><FaArrowRight /></span>,
        <div className='final-price' key={`final-price ${index}`}>{session.finalValue(item.priceOf(item, person)).toFixed(2)}</div>
      ]).reduce((all, arr) => all.concat(arr), [])}
    </div>
  </div>
}