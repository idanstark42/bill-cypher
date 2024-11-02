import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Init from './pages/init'
import Participate from './pages/participate'
import Admin from './pages/admin'

import { UserProvider } from './helpers/user'
import { LoadingProvider } from './helpers/use-loading'
import Loader from './components/loader'

import './App.scss'

export default function App () {
  return (
    <LoadingProvider>
      <Loader />
      <UserProvider>
        <Router>
          <Routes>
            <Route path='/participate/:id' element={<Participate />} />
            <Route path='/admin/:id' element={<Admin />} />
            <Route path='/' element={<Init />} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Router>
      </UserProvider>
    </LoadingProvider>
  )
}