import { useState } from 'react'
import { FaRegTrashAlt, FaSave } from 'react-icons/fa'

import Loader from './loader'
import EditableValue from './editable-value'

export default function TipsAndDiscounts ({ session }) {
  const [loading, setLoading] = useState(false)
  const [addingTip, setAddingTip] = useState('none')
  const [addingDiscount, setAddingDiscount] = useState('none')

  async function setTip (index, value) {
    setLoading(true)
    await session.update({ $set: { [`data.tips.${index}.value`]: value } })
    setLoading(false)
  }

  async function removeTip (index) {
    setLoading(true)
    await session.removeTip(index)
    setLoading(false)
  }

  async function addTip () {
    setLoading(true)
    await session.addTip(addingTip)
    setAddingTip('none')
    setLoading(false)
  }

  async function setDiscount (index, value) {
    setLoading(true)
    await session.update({ $set: { [`data.discounts.${index}.value`]: value } })
    setLoading(false)
  }

  async function removeDiscount (index) {
    setLoading(true)
    await session.removeDiscount(index)
    setLoading(false)
  }

  async function addDiscount () {
    setLoading(true)
    await session.addDiscount(addingDiscount)
    setAddingDiscount('none')
    setLoading(false)
  }

  return <div className='tips-and-discounts'>
    {loading && <Loader />}
    <div className='title' style={{ fontSize: '3rem', margin: 0 }}>Tips</div>
    <div className='text'>tips are added</div>
    {session.data.tips?.map((tip, index) => <div className='tip' key={index}>
      <span><EditableValue control={[tip.value, val => setTip(index, val)]} /></span>
      <FaRegTrashAlt onClick={() => removeTip(index)} />
    </div>)}
    {isFinite(addingTip) ? <div className='tip'>
      <div className='value'>
        <input type='number' value={addingTip} onChange={e => setAddingTip(e.target.value)} />%
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <FaSave onClick={addTip} />
        <FaRegTrashAlt onClick={() => setAddingTip('none')} />
      </div>
    </div> : <div className='add-tip blue button' onClick={() => setAddingTip(10)}>Add tip</div> }
    <div className='title' style={{ fontSize: '3rem', margin: 0 }}>Discounts</div>
    <div className='text'>discounts are multiplied</div>
    {session.data.discounts?.map((discount, index) => <div className='discount' key={index}>
      <span><EditableValue control={[discount.value, val => setDiscount(index, val)]} /></span>
      <FaRegTrashAlt onClick={() => removeDiscount(index)} />
    </div>)}
    {isFinite(addingDiscount) ? <div className='discount'>
      <div className='value'>
        <input type='number' value={addingDiscount} onChange={e => setAddingDiscount(e.target.value)} />%
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <FaSave onClick={addDiscount} />
        <FaRegTrashAlt onClick={() => setAddingDiscount('none')} />
      </div>
    </div> : <div className='add-discount blue button' onClick={() => setAddingDiscount(10)}>Add discount</div>}
  </div>
}