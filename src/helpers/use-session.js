import { useState, useEffect } from 'react'

import { useLoading } from './use-loading'
import Session from './session'

export default function useSession () {
  const [session, setSession] = useState()
  const { loading, setLoading } = useLoading()
  const [syncInterval, setSyncInterval] = useState(null)

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      const session = await Session.load(id)
      setSession(session)
      setLoading(false)
    }

    load()
  }, [])

  useEffect(() => {
    if (session && !syncInterval) {
      setSyncInterval(setInterval(() => session.sync(), 5000))
    }
  }, [session, syncInterval])

  return session
}