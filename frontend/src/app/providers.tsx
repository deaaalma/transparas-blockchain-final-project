import type { ReactNode } from 'react'
import { AuthProvider } from '../features/auth'
import { WalletProvider } from '../features/blockchain/WalletContext'
import { ToastProvider } from '../components/ui/ToastContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </WalletProvider>
    </AuthProvider>
  )
}
