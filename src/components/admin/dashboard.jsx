import React, { useState } from 'react'
import {QRCodeCanvas} from 'qrcode.react'
import { FaCheck, FaCopy } from 'react-icons/fa'

export default function Dashboard ({ enabled=true, session, setView }) {
  const [showingCopy, setShowingCopy] = useState(false)

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
      <div style={{ fontWeight: 'bold' }}>Bill</div>
      <div className='items' style={{ flexGrow: 1, overflowY: 'auto' }}>
        {session.items.map(item => <div key={item.index} style={{ display: 'flex', justifyContent: 'space-between', height: '2rem' }}>
          {item.participations.length === 0 ?
            <div>{item.value} (unclaimed)</div> : 
            <div>{item.value} / {item.participations.length}</div>}
        </div>)}
      </div>
      <div style={{ width: '100%', height: '2px', background: 'black', margin: '0.5rem 0' }} />
      Total: {session.total} | {session.items.length} items
    </div>
    <div className='card stats' style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
    </div>
  </div>
}

