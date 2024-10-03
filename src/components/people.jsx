import PositionedImage from './positioned-image'

export default function People ({ session }) {
  return <div className='people cards'>
    <img src={session.data.image} alt='people' style={{ display: 'none' }} />
    {session.people.map((person, index) => <div className='person card' key={index}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div className='name' style={{ fontWeight: 'bold' }}>{person.name}</div>
        <div className='total' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div style={{ fontWeight: 'bold' }}>total: {person.total.toFixed(2)}</div>
          {session.discount ? <div className='discount'>-{session.discount.toFixed(2)}%</div> : ''}
          {session.tip ? <div className='tip'>+{session.tip.toFixed(2)}%</div> : ''}
          {session.tip || session.discount ? <div className='total-with-tip-discount' style={{ fontWeight: 'bold' }}>{session.finalValue(person.total).toFixed(2)}</div> : null}
        </div>
      </div>
      <div className='items'>
        {person.items.map((item, index) => [
          <div className='value' key={`value ${index}`}>{session.finalValue(item.priceOf(person.sessionData)).toFixed(2)}</div>,
          <PositionedImage item={item} imageURL={session.data.image} key={`image ${index}`} />
        ])}
      </div>
    </div>)}
  </div>
}
