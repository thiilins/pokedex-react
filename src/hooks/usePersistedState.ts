import { useState, useEffect, Dispatch, SetStateAction } from 'react'

type Response<T> = [T, Dispatch<SetStateAction<T>>]

function usePersistedState<T>(
  key: string,
  initialState: T,
  isString = false,
  havePrefix = true
): Response<T> {
  const prefix = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_STORAGE_PREFIX || 'pokedex' : 'pokedex'
  const keyValue = havePrefix ? `${prefix}:${key}` : key
  
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialState
    }
    
    try {
      const storageValue = localStorage.getItem(keyValue)
      if (storageValue) {
        return isString ? (storageValue as unknown as T) : JSON.parse(storageValue)
      }
    } catch (e) {
      console.warn('Error reading localStorage key', keyValue, e)
    }
    
    return initialState
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(keyValue, isString ? String(state) : JSON.stringify(state))
    } catch (e) {
      console.warn('Error writing localStorage key', keyValue, e)
    }
  }, [key, state, isString, keyValue])

  return [state, setState]
}

export default usePersistedState
