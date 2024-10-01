import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Init from './pages/init'
import Participate from './pages/participate'
import Summary from './pages/summary'

import './App.scss'

export default function App () {
  return (
    <Router>
      <Routes>
        <Route path='/participate/:id' element={<Participate />} />
        <Route path='/summary/:id' element={<Summary />} />
        <Route path='/' element={<Init />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  )
}