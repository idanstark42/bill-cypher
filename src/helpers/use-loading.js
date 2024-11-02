import { useState, createContext, useContext } from 'react'

export const LoadingContext = createContext()

export function LoadingProvider ({ children }) {
  const [loading, setLoading] = useState(true)

  const whileLoading = async callback => {
    setLoading(true)
    await callback()
    setLoading(false)
  }

  return <LoadingContext.Provider value={{ loading, setLoading, whileLoading }}>
    {children}
  </LoadingContext.Provider>
}

export function useLoading () {
  return useContext(LoadingContext)
}
