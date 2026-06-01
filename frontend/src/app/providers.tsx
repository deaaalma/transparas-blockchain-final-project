import type { ReactNode } from 'react'
import { AuthProvider } from '../features/auth'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {/* tambah provider lain di sini */}
      {children}
    </AuthProvider>
  )
}
