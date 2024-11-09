import { useState, useEffect, useContext, createContext } from 'react'

import { useLoading } from './use-loading'
import Session from './session'

const SessionContext = createContext()

export function SessionProvider ({ children }) {
  const [session, setSession] = useState()
  const { setLoading } = useLoading()
  const [syncInterval, setSyncInterval] = useState(null)

  useEffect(() => {
    const id = window.location.pathname.split('/')[2]

    const load = async () => {
      const session = await Session.load(id)
      session.fullUpdate = async (...params) => {
        await session.update(...params)
        await load()
      }
      session.fullRawUpdate = async (...params) => {
        await session.rawUpdate(...params)
        await load()
      }
      setSession(session)
      setLoading(false)
    }

    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (session && !syncInterval) {
      setSyncInterval(setInterval(() => session.sync(), 5000))
    }
  }, [session, syncInterval])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export function useSession () {
  return useContext(SessionContext)
}
