import { useState } from 'react'
import { FaRegTrashAlt, FaSave } from 'react-icons/fa'

import Loader from './loader'

export default function TipsAndDiscounts ({ session }) {
  const [loading, setLoading] = useState(false)
  const [addingTip, setAddingTip] = useState('none')
  const [addingDiscount, setAddingDiscount] = useState('none')

  async function removeDiscount (index) {
    setLoading(true)
    await session.removeDiscount(index)
    setLoading(false)
  }

  async function saveDiscount () {
    setLoading(true)
    await session.addDiscount(addingDiscount)
    setLoading(false)
  }

  async function saveTip () {
    setLoading(true)
    await session.addTip(addingTip)
    setLoading(false)
  }

  return <div className='tips-and-discounts'>
    {loading && <Loader />}
    <div className='title' style={{ fontSize: '3rem', margin: 0 }}>Tips</div>
    <div className='text'>tips are added</div>
    {session.data.tips?.map((tip, index) => <div className='tip' key={index}>
      <div className='value'>{tip.value}%</div>
    </div>)}
    {isFinite(addingTip) ? <div className='tip'>
      <div className='value'>
        <input type='number' value={addingTip} onChange={e => setAddingTip(e.target.value)} />%
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <FaSave onClick={saveTip} />
        <FaRegTrashAlt onClick={() => setAddingTip('none')} />
      </div>
    </div> : <div className='add-tip blue button' onClick={() => setAddingTip(10)}>Add tip</div> }
    <div className='title' style={{ fontSize: '3rem', margin: 0 }}>Discounts</div>
    <div className='text'>discounts are multiplied</div>
    {session.data.discounts?.map((discount, index) => <div className='discount' key={index}>
      <div className='value'>{discount.value}%</div>
      <FaRegTrashAlt onClick={() => removeDiscount(index)} />
    </div>)}
    {isFinite(addingDiscount) ? <div className='discount'>
      <div className='value'>
        <input type='number' value={addingDiscount} onChange={e => setAddingDiscount(e.target.value)} />%
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <FaSave onClick={saveDiscount} />
        <FaRegTrashAlt onClick={() => setAddingDiscount('none')} />
      </div>
    </div> : <div className='add-discount blue button' onClick={() => setAddingDiscount(10)}>Add discount</div>}
  </div>
}