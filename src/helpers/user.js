import { useState, useEffect, createContext, useContext } from 'react'
import cookie from 'js-cookie'

export const UserContext = createContext()

const DEFAULT_USER = 'anonymous'
const USER_KEY = 'user'

export function UserProvider ({ children }) {
  const [user, setUser] = useState(DEFAULT_USER)

  useEffect(() => {
    const user = cookie.get(USER_KEY)
    setUser(user || DEFAULT_USER)
  }, [setUser])

  const updateUser = async (newUser) => {
    cookie.set(USER_KEY, newUser)
    setUser(newUser)
  }

  return <UserContext.Provider value={[user, updateUser]}>
    {children}
  </UserContext.Provider>
}

export function useUser () {
  return useContext(UserContext)
}