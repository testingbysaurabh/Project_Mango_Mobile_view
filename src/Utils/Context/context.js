import { createContext, useContext } from 'react'

// GlobalContext is the shared React context for small global state
export const GlobalContext = createContext()

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}
