import { useState } from 'react'
import { useEffect } from 'react'   
import { useRef } from 'react'
import type { Item } from '../types'
import { searchItems } from '../services/mockApi'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const requestIdRef = useRef(0)


  useEffect(() => {
  const requestId = ++requestIdRef.current

  const timer = setTimeout(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await searchItems(query)

      if (requestId === requestIdRef.current) {
        setResults(data)
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong'
        )
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, 300)

  return () => {
    clearTimeout(timer)
  }
}, [query])

  return { query, setQuery, results, isLoading, error }
}
