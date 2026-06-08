import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/blockchain';

export interface Transaction {
  id: number;
  keterangan: string;
  nominal: number;
  isIncome: boolean;
  timestamp: Date;
  addedBy: string;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export function useBlockchain() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inisialisasi Ethers provider dan contract
  const initBlockchain = useCallback(async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const ethProvider = new BrowserProvider((window as any).ethereum);
        setProvider(ethProvider);

        const network = await ethProvider.getNetwork();
        const chainId = Number(network.chainId);
        
        let dynamicContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_LOCAL || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        if (chainId === 80002) {
          dynamicContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS_AMOY || "0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62";
        }
        
        console.log("Connected Chain ID:", chainId);
        console.log("Using Contract Address:", dynamicContractAddress);

        // Jika dompet belum terhubung, kita gunakan provider (read-only)
        const readOnlyContract = new Contract(dynamicContractAddress, CONTRACT_ABI, ethProvider);
        setContract(readOnlyContract);

        // Cek apakah sudah terhubung sebelumnya
        const accounts = await ethProvider.send("eth_accounts", []);
        if (accounts.length > 0) {
          const userAddress = accounts[0];
          setAddress(userAddress);
          setIsConnected(true);
          
          const ethSigner = await ethProvider.getSigner();
          setSigner(ethSigner);
          
          // Upgrade contract jadi bisa write (pakai signer)
          const rwContract = new Contract(dynamicContractAddress, CONTRACT_ABI, ethSigner);
          setContract(rwContract);

          // Cek apakah owner
          const contractOwner = await rwContract.owner();
          setIsOwner(contractOwner.toLowerCase() === userAddress.toLowerCase());
        }
      } catch (err) {
        console.error("Gagal inisialisasi blockchain:", err);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error("MetaMask tidak terdeteksi!");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initBlockchain();

    // Listener jika user ganti akun di MetaMask
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          initBlockchain(); // reload
        } else {
          // Disconnected
          setAddress(null);
          setSigner(null);
          setIsConnected(false);
          setIsOwner(false);
        }
      });
      (window as any).ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeAllListeners('accountsChanged');
        (window as any).ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [initBlockchain]);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        await initBlockchain();
      } catch (err) {
        console.error("Gagal konek wallet:", err);
        throw err;
      }
    } else {
      alert("Silakan install ekstensi MetaMask!");
    }
  };

  const reconnectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        });
        // The accountsChanged event listener will automatically trigger initBlockchain
      } catch (err) {
        console.error("Gagal reconnect wallet:", err);
        throw err;
      }
    } else {
      alert("Silakan install ekstensi MetaMask!");
    }
  };

  const getTransactions = async (): Promise<Transaction[]> => {
    if (!contract) return [];
    try {
      const txs = await contract.getTransactions();
      return txs.map((tx: any) => ({
        id: Number(tx.id),
        keterangan: tx.keterangan,
        nominal: Number(tx.nominal),
        isIncome: tx.isIncome,
        timestamp: new Date(Number(tx.timestamp) * 1000),
        addedBy: tx.addedBy
      }));
    } catch (err) {
      console.error("Gagal getTransactions:", err);
      return [];
    }
  };

  const getBalance = async (): Promise<Balance> => {
    if (!contract) return { income: 0, expense: 0, balance: 0 };
    try {
      const bal = await contract.getBalance();
      return {
        income: Number(bal.income),
        expense: Number(bal.expense),
        balance: Number(bal.balance)
      };
    } catch (err) {
      console.error("Gagal getBalance:", err);
      return { income: 0, expense: 0, balance: 0 };
    }
  };

  const addTransaction = async (keterangan: string, nominal: number, isIncome: boolean) => {
    if (!contract || !signer) throw new Error("Wallet belum terhubung");
    if (!isOwner) throw new Error("Akses ditolak: Hanya bendahara yang dapat menambah transaksi");

    try {
      const tx = await contract.addTransaction(keterangan, nominal, isIncome);
      await tx.wait(); // Tunggu sampai transaksi masuk ke block
      return tx;
    } catch (err) {
      console.error("Gagal addTransaction:", err);
      throw err;
    }
  };

  return {
    provider,
    signer,
    contract,
    address,
    isOwner,
    isConnected,
    isLoading,
    connectWallet,
    reconnectWallet,
    getTransactions,
    getBalance,
    addTransaction
  };
}
