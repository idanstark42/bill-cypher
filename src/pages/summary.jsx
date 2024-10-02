import { useState, useEffect } from 'react'
import { FaUser, FaShoppingCart, FaPercent } from 'react-icons/fa'
import { FaPlusMinus } from 'react-icons/fa6'

import Session from '../helpers/session'
import Items from '../components/items'
import People from '../components/people'
import useModal from '../components/modal'
import EditableValue from '../components/editable-value'
import Loader from '../components/loader'
import TipsAndDiscounts from '../components/tips-and-discounts'

export default function Summary () {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [tab, setTab] = useState('items')
  const [total, setTotal] = useState(0)
  const { Modal: TipsAndDiscountsModal, open: openTipsAndDiscounta } = useModal('tips-and-discounts')

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      const session = await Session.load(id)
      setSession(session)
      setTotal(session.total)
      setLoading(false)
    }
    load()
  }, [])

  async function updateTotal (value) {
    setLoading(true)
    await session.update({ $set: { 'data.total.value': value } })
    setTotal(value)
    setLoading(false)
  }

  if (loading) return <Loader />

  console.log(session.data)

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
        Total: <EditableValue name='Total' control={[total, updateTotal]} /> {totalDiff ? <span style={{ color: 'red' }}>({totalDiff > 0 ? '-' : '+'}{Math.abs(totalDiff).toFixed(2)})</span> : ''}
      </div>
      <div className='button blue' onClick={openTipsAndDiscounta}>
        <FaPlusMinus /><FaPercent />
      </div>
    </div>
    <TipsAndDiscountsModal>
      <TipsAndDiscounts session={session} />
    </TipsAndDiscountsModal>
  </div>
}