import React, { useState, useEffect } from 'react'

import Session from '../helpers/session'

import Home from '../components/stages/home'
import Select from '../components/stages/select'
import Corrections from '../components/stages/corrections'
import Additions from '../components/stages/additions'

import { useLoading } from '../helpers/use-loading'

export default function Init () {
  const { setLoading } = useLoading()
  const [stage, setStage] = useState(0)
  const [session, setSession] = useState({})
  const [move, setMove] = useState(0)
 
  useEffect(() => setLoading(false), [])

  useEffect(() => {
    if (move === 0) return
    (async () => {
      if (stage + move < 0) return
      if (stage + move >= STAGES.length) {
        setLoading(true)
        const newSession = await Session.create(session)
        window.location.href = `${window.location.origin}/admin/${newSession.id}`
        return
      }
      setStage(stage + move)
      setMove(0)
    })()
  }, [session])

  const Stage = STAGES[stage]

  return <>
    <Stage session={session} setSession={setSession} move={setMove} setLoading={setLoading} />
  </>
}

const STAGES = [Home, Select, Additions, Corrections]