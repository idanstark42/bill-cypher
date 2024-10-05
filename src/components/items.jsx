import React, { useState } from 'react'
import { FaArrowRight, FaHashtag, FaPercentage, FaChartPie } from 'react-icons/fa'

import PositionedImage from './positioned-image'
import EditableValue from './editable-value'
import { useForceUpdate } from '../helpers/force-update'

export default function Items ({ session }) {
  return <div className='items cards'>
    <img src={session.data.image} alt='items' style={{ display: 'none' }} />
    {session.items.map((item, index) => <Item key={index} item={item} session={session} />)}
  </div>
}

const DISPLAYS = {
  number: { Icon: FaHashtag, show: (item, person) => item.priceOf(person).toFixed(2), update: (item, person) => (value => item.setPriceOf(person, Number(value))) },
  percentage: { Icon: FaPercentage, show: (item, person) => item.percentOf(person).toFixed(2), update: (item, person) => (value => item.setPercentOf(person, Number(value))) },
  shares: { Icon: FaChartPie, show: (item, person) => item.sharesOf(person).toFixed(2), update: (item, person) => (value => item.setSharesOf(person, Number(value))) }
}

function Item ({ item, session }) {
  const [display, setDisplay] = useState('number')
  const forceUpdate = useForceUpdate()

  const update = (method) => (async value => {
    method(value)
    forceUpdate()
    // assign values to the item._item object
    item.flush()
    await session.update({ '$set': { 'data': session.data } })
  })

  return <div className='item card'>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem', alignItems: session.tip || session.discount ? 'flex-start' : 'center' }}>
      <div className='price' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontWeight: 'bold' }}>{item.value.toFixed(2)}</div>
        {session.discount ? <div className='discount'>-{session.discount.toFixed(2)}%</div> : ''}
        {session.tip ? <div className='tip'>+{session.tip.toFixed(2)}%</div> : ''}
        {session.discount || session.tip ? <div className='final-value' style={{ fontWeight: 'bold' }}>{session.finalValue(item.value).toFixed(2)}</div> : ''}
      </div>
      <PositionedImage item={item} imageURL={session.data.image} />
    </div>
    <div className='paying-title' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
      <div style={{ fontWeight: 'bold', flexGrow: 1 }}>paying</div>
      <div className='side-buttons' style={{ display: 'flex', gap: '0.5rem', flexGrow: 5, alignItems: 'center' }}>
        {Object.entries(DISPLAYS).map(([key, { Icon }]) => <Icon key={key} onClick={() => setDisplay(key)} style={{ cursor: 'pointer', ...(display === key ? { background: 'black', color: '#878989', borderRadius: '50%', padding: 4 } : {}) }} />)}
      </div>
    </div>
    <div className='participations'>
      {item.people.map((person, index) => [
        <div className='name' key={`name ${index}`}>{person.name}</div>,
        <div className='price' key={`price ${index}`}>
          {Object.keys(DISPLAYS).map(d => {
            return <span style={(d === display) ? {} : { display: 'none' }} key={d}>
              <EditableValue name={d} control={[DISPLAYS[d].show(item, person), update(DISPLAYS[d].update(item, person))]} />
            </span>
          }).reduce((all, arr) => all.concat(arr), [])}
        </div>,
        <span key={`arrow ${index}`}><FaArrowRight /></span>,
        <div className='final-price' key={`final-price ${index}`}>{session.finalValue(item.priceOf(person)).toFixed(2)}</div>
      ]).reduce((all, arr) => all.concat(arr), [])}
    </div>
  </div>
}