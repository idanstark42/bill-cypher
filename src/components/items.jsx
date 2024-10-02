import { FaArrowRight } from 'react-icons/fa'
import PositionedImage from './positioned-image'

export default function Items ({ session }) {
  return <div className='items cards'>
    <img src={session.data.image} alt='items' style={{ display: 'none' }} />
    {session.items.map((item, index) => <div className='item card' key={index}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
        <div className='price' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ fontWeight: 'bold' }}>{item.value.toFixed(2)}</div>
          {session.discount ? <div className='discount'>-{session.discount.toFixed(2)}%</div> : ''}
          {session.tip ? <div className='tip'>+{session.tip.toFixed(2)}%</div> : ''}
          <div className='final-value' style={{ fontWeight: 'bold' }}>{session.finalValue(item.value).toFixed(2)}</div>
        </div>
        <PositionedImage item={item} imageURL={session.data.image} />
      </div>
      <div style={{ fontWeight: 'bold' }}>paying</div>
      <div className='participations'>
        {item.participations.map((person, index) => [
          <div className='name' key={`name ${index}`}>{person.name}</div>,
          <div className='price' key={`price ${index}`}>{item.pricePerPerson.toFixed(2)}</div>,
          <span key={`arrow ${index}`}><FaArrowRight /></span>,
          <div className='final-price' key={`final-price ${index}`}>{session.finalValue(item.pricePerPerson).toFixed(2)}</div>
        ]).reduce((all, arr) => all.concat(arr), [])}
      </div>
    </div>)}
  </div>
}