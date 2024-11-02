import { useState, useEffect, createContext, useContext } from 'react'
import cookie from 'js-cookie'

export const UserContext = createContext()

const DEFAULT_USER = 'anonymous'
const USER_KEY = 'user'
const USER_ID_KEY = 'user-id'

export function UserProvider ({ children }) {
  const [user, setUser] = useState(DEFAULT_USER)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const user = cookie.get(USER_KEY)
    setUser(user || DEFAULT_USER)
    const userId = cookie.get(USER_ID_KEY)
    if (userId) {
      setUserId(userId)
    } else {
      generateUserId()
    }
  }, [setUser])

  const generateUserId = () => {
    const id = Math.random().toString(36).substring(2, 15)
    cookie.set(USER_ID_KEY, id)
    setUserId(id)
  }

  const updateUser = async (newUser) => {
    cookie.set(USER_KEY, newUser)
    setUser(newUser)
  }

  return <UserContext.Provider value={{ user, setUser: updateUser, userId }}>
    {children}
  </UserContext.Provider>
}

export function useUser () {
  return useContext(UserContext)
}