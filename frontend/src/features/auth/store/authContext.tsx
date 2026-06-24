/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react'
import type { ReactNode, Dispatch } from 'react'

interface User { id: string; name: string; email: string }
interface AuthState { user: User | null; isLoading: boolean }
type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AuthState = { user: null, isLoading: false }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':    return { ...state, user: action.payload, isLoading: false }
    case 'LOGOUT':      return { ...state, user: null }
    case 'SET_LOADING': return { ...state, isLoading: action.payload }
    default:            return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: Dispatch<AuthAction>
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
