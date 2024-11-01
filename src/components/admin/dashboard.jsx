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
    <div className='card share' style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <QRCodeCanvas value={session.shareURL} style={{ width: '100%', aspectRatio: 1, flexGrow: 1, height: 'unset' }} />
      <div className='text' onClick={copy} style={{ color: 'black', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {showingCopy ? <FaCheck /> : <FaCopy />}
        <span style={{ width: 'calc(100% - 1.5rem)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.shareURL}</span>
      </div>
    </div>
  </div>
}