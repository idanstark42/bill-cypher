import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './App.scss'

import Init from './pages/init'
import Finalize from './pages/finalize'
import Participate from './pages/participate'

export default function App () {
  return <Router>
    <Switch>
      <Route path="/init" component={Init} />
      <Route path="/finalize" component={Finalize} />
      <Route path="/participate" component={Participate} />
    </Switch>
  </Router>
}