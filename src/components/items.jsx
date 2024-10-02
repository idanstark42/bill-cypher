import PositionedImage from './positioned-image'

export default function Items ({ session }) {
  return <div className='items cards'>
    <img src={session.data.image} alt='items' style={{ display: 'none' }} />
    {session.items.map((item, index) => <div className='item card' key={index}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '1rem' }}>
        <div className='price'>{item.value.toFixed(2)}</div>
        <PositionedImage item={item} imageURL={session.data.image} />
      </div>
      <div style={{ fontWeight: 'bold' }}>paying</div>
      <div className='participations'>
        {item.participations.map((person, index) => <div className='participation' key={index}>
          <div className='name'>{person.name}</div>
          <div className='price'>{item.pricePerPerson.toFixed(2)}</div>
        </div>)}
      </div>
    </div>)}
  </div>
}