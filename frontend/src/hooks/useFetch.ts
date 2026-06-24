import { useState, useEffect } from 'react'

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<FetchState<T>>({
    data: null, isLoading: true, error: null,
  })

  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(s => ({ ...s, isLoading: true, error: null }))
    fetcher()
      .then(data => { if (!cancelled) setState({ data, isLoading: false, error: null }) })
      .catch(err => { if (!cancelled) setState({ data: null, isLoading: false, error: err.message }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
