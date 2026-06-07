import { createContext, useContext, type ReactNode } from 'react';
import { useBlockchain } from '../../hooks/useBlockchain';
import type { Transaction, Balance } from '../../hooks/useBlockchain';
import type { ethers, BrowserProvider, Contract } from 'ethers';

interface WalletContextType {
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
  contract: Contract | null;
  address: string | null;
  isOwner: boolean;
  isConnected: boolean;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  reconnectWallet: () => Promise<void>;
  getTransactions: () => Promise<Transaction[]>;
  getBalance: () => Promise<Balance>;
  addTransaction: (keterangan: string, nominal: number, isIncome: boolean) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const blockchainInfo = useBlockchain();

  return (
    <WalletContext.Provider value={blockchainInfo}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
