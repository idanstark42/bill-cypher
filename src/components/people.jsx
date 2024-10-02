import PositionedImage from './positioned-image'

export default function People ({ session }) {
  return <div className='people cards'>
    <img src={session.data.image} alt='people' style={{ display: 'none' }} />
    {session.people.map((person, index) => <div className='person card' key={index}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div className='name' style={{ fontWeight: 'bold' }}>{person.name}</div>
        <div className='total' style={{ fontWeight: 'bold' }}>total: {person.total.toFixed(2)}</div>
      </div>
      <div style={{ fontWeight: 'bold' }}>items</div>
      <div className='items'>
        {person.items.map((item, index) => <div className='item' key={index}  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem' }}>
          <div className='value'>{item.value.toFixed(2)}</div>
          <PositionedImage item={item} imageURL={session.data.image} />
        </div>)}
      </div>
    </div>)}
  </div>
}
