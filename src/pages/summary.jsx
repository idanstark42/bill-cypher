import { useState, useEffect } from 'react'
import { FaUser, FaShoppingCart, FaPercent } from 'react-icons/fa'
import { FaPlusMinus } from 'react-icons/fa6'

import Session from '../helpers/session'
import Items from '../components/items'
import People from '../components/people'
import useModal from '../components/model'

export default function Summary () {
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('items')
  const { Modal: TipsAndDiscountsModal, open: openTipsAndDiscounta } = useModal('tips-and-discounts')

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      setSession(await Session.load(id))
    }
    load()
  }, [])

  if (!session) return null

  console.log(session.data)

  const total = session.total
  const totalDiff = session.totalDiff

  return <div className='summary'>
    <div className='tabs'>
      <div className={`tab ${tab === 'items' ? 'yellow' : 'blue'} button`} onClick={() => setTab('items')}>
        <FaShoppingCart />
        <span>Items</span>
      </div>
      <div className={`tab ${tab === 'people' ? 'yellow' : 'blue'} button`} onClick={() => setTab('people')}>
        <FaUser />
        <span>People</span>
      </div>
    </div>
    <div className='content'>
      {tab === 'items' ? <Items session={session} /> : <People session={session} />}
    </div>
    <div className='drawer'>
      <div className='total text'>
        total: {total} {totalDiff ? <span style={{ color: 'red' }}>({totalDiff > 0 ? 'missing ' : 'over by '}{Math.abs(totalDiff).toFixed(2)})</span> : ''}
      </div>
      <div className='button blue' onClick={openTipsAndDiscounta}>
        <FaPlusMinus /><FaPercent />
      </div>
    </div>
    <TipsAndDiscountsModal>
      <div className='tips-and-discounts'>
        <div className='title'>Tip</div>
        {session.data.tips?.map((tip, index) => <div className='tip' key={index}>
          <div className='value'>{tip.value}%</div>
        </div>)}
        <div className='add-tip blue button'>Add tip</div>
        <div className='title'>Discount</div>
        {session.data.discounts?.map((discount, index) => <div className='discount' key={index}>
          <div className='value'>{discount.value}%</div>
        </div>)}
        <div className='add-discount blue button'>Add discount</div>
      </div>
    </TipsAndDiscountsModal>
  </div>
}