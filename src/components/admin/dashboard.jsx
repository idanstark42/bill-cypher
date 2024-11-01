import React, { useState } from 'react'
import {QRCodeCanvas} from 'qrcode.react'
import { FaCheck, FaCopy } from 'react-icons/fa'

export default function Dashboard ({ enabled, session, setView }) {
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
    <div className='card data' style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
    </div>
    <div className='card data' style={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
    </div>
  </div>
}

