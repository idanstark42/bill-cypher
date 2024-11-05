import React, { useEffect, useState } from 'react'
import {QRCodeCanvas} from 'qrcode.react'
import { FaCheck, FaCopy, FaUsers, FaDollarSign } from 'react-icons/fa'

import EditableValue from '../editable-value'

export default function Dashboard ({ enabled=true, session, setView }) {
  const [showingCopy, setShowingCopy] = useState(false)
  const [tip, setTip] = useState(session?.tip)
  const [loadingTip, setLoadingTip] = useState(false)
  const [discount, setDiscount] = useState(session?.discount)
  const [loadingDiscount, setLoadingDiscount] = useState(false)
  const [total, setTotal] = useState(session?.discount)
  const [loadingTotal, setLoadingTotal] = useState(false)

  useEffect(() => {
    if (!session) return
    setTip(session.tip)
    setDiscount(session.discount)
    setTotal(session.total)
  }, [session])

  useEffect(() => {
    if (!session) return
    (async () => {
      setLoadingTip(true)
      await session.setTip(tip)
      setLoadingTip(false)
    })()
  }, [tip, session, setLoadingTip])

  useEffect(() => {
    if (!session) return
    (async () => {
      setLoadingDiscount(true)
      await session.setDiscount(discount)
      setLoadingDiscount(false)
    })()
  }, [discount, session, setLoadingDiscount])

  useEffect(() => {
    if (!session) return
    (async () => {
      setLoadingTotal(true)
      await session.setTotal(total)
      setLoadingTotal(false)
    })()
  }, [total, session, setLoadingTotal])

  const copy = () => {
    navigator.clipboard.writeText(session.shareURL)
    setShowingCopy(true)
    setTimeout(() => setShowingCopy(false), 1000)
  }

  if (!enabled) return null

  return <div className='dashboard'>
    <div className='card share' style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', gridColumn: 'span 4' }}>
      <QRCodeCanvas bgColor='#f0d07d' value={session.shareURL} style={{ width: '60vw', aspectRatio: 1, flexGrow: 1, height: 'unset', padding: '1rem', boxSizing: 'border-box', borderRadius: '0.5rem', boxShadow: '0px 0px 3px 0.5px #403007', background: '#f0d07d' }} />
      <div className='text' onClick={copy} style={{ width: '80vw', color: 'black', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {showingCopy ? <FaCheck /> : <FaCopy />}
        <span style={{ width: 'calc(100% - 1.5rem)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.shareURL}</span>
      </div>
    </div>
    <div className='card bill' style={{ gridColumn: 'span 2', gridRow: 'span 2', flexDirection: 'column' }}>
      <div style={{ fontWeight: 'bold', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaDollarSign />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaUsers/>
        </div>
      </div>
      <div className='items' style={{ flexGrow: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: `repeat(${session.items.length}, 2rem)` }}>
        {session.items.map(item => <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.participations.length}
            </div>
            <div></div>
            <div></div>
          </>
        )}
      </div>
      <div style={{ width: '100%', height: '2px', background: 'black', margin: '0.5rem 0' }} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', flex: 1, justifyContent: 'center' }}>{session.total}</div>
        <div style={{ display: 'flex', alignItems: 'center', flex: 3, justifyContent: 'right' }}>{session.items.length} items</div>
      </div>
    </div>
    <div className='card actions' style={{ gridColumn: 'span 2', gridRow: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: '2rem 2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>Bill</div>
      {loadingTotal ? '...' : <EditableValue name='discount' control={[total, setTotal]} style={{ width: '5rem', minWidth: 0 }} inputStyle={{ width: '2rem', minWidth: 0 }} />}
      <div style={{ display: 'flex', alignItems: 'center' }}>Tip</div>
      {loadingTip ? '...' : <EditableValue name='tip' control={[tip, setTip]} style={{ width: '5rem', minWidth: 0 }} inputStyle={{ width: '2rem', minWidth: 0 }} />}
      <div style={{ display: 'flex', alignItems: 'center' }}>Discount</div>
      {loadingDiscount ? '...' : <EditableValue name='discount' control={[discount, setDiscount]} style={{ width: '5rem', minWidth: 0 }} inputStyle={{ width: '2rem', minWidth: 0 }} />}
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>Total</div>
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>{session.finalTotal}</div>
    </div>
  </div>
}

