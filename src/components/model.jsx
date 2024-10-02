import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

export default function useModal (id) {
  const [show, setShow] = useState(false)
  const Modal = ({ children }) => {
    if (!show) return null
    return <div className='modal' id={id}>
      <div className='close' onClick={() => setShow(false)}><FaTimes /></div>
      <div className='content'>
        {children}
      </div>
    </div>  
  }

  return { Modal, open: () => setShow(true), close: () => setShow(false) }
}
