import { useEffect, useState } from 'react';
import { useWallet } from '../features/blockchain/WalletContext';
import type { Transaction, Balance } from '../hooks/useBlockchain';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Wallet, ArrowDownRight, ArrowUpRight, History } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { isConnected, connectWallet, getTransactions, getBalance, isOwner } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({ income: 0, expense: 0, balance: 0 });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const txs = await getTransactions();
        const bal = await getBalance();
        if (isMounted) {
          setTransactions(txs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
          setBalance(bal);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };
    
    // Ambil data pertama kali
    fetchData();
    
    // Polling setiap 15 detik untuk simulasi real-time update
    const intervalId = setInterval(fetchData, 15000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [getTransactions, getBalance]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-bali-maroon)]">TransParas</h1>
          <p className="text-sm text-[var(--color-bali-ink)]/70 mt-1">Transparansi Keuangan Adat Bali Berbasis Blockchain</p>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <Link to="/tambah">
              <Button variant="primary">Tambah Transaksi</Button>
            </Link>
          )}
          {!isConnected ? (
            <Button variant="outline" onClick={connectWallet} className="flex items-center gap-2">
              <Wallet className="w-4 h-4" /> Hubungkan Dompet
            </Button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Terhubung {isOwner && "(Bendahara)"}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-[var(--color-bali-maroon)] to-[var(--color-bali-maroon-dark)] text-white border-none shadow-lg">
          <h3 className="text-white/80 font-medium mb-2">Total Saldo Kas</h3>
          <div className="text-3xl font-bold font-serif">{formatIDR(balance.balance)}</div>
        </Card>
        
        <Card className="p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <h3 className="text-[var(--color-bali-ink)]/70 font-medium">Total Pemasukan</h3>
          </div>
          <div className="text-2xl font-bold text-[var(--color-bali-ink)]">{formatIDR(balance.income)}</div>
        </Card>

        <Card className="p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <h3 className="text-[var(--color-bali-ink)]/70 font-medium">Total Pengeluaran</h3>
          </div>
          <div className="text-2xl font-bold text-[var(--color-bali-ink)]">{formatIDR(balance.expense)}</div>
        </Card>
      </div>

      {/* Transactions List */}
      <Card className="p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-black/[0.02]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--color-bali-gold-dark)]" />
            <h2 className="text-lg font-semibold text-[var(--color-bali-ink)]">Riwayat Transaksi Terakhir</h2>
          </div>
          {loadingData && <span className="text-sm text-[var(--color-bali-ink)]/50 animate-pulse">Memuat dari blockchain...</span>}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/[0.02] text-[var(--color-bali-ink)]/70 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium">Keterangan</th>
                <th className="px-6 py-4 font-medium">Tipe</th>
                <th className="px-6 py-4 font-medium text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {transactions.length > 0 ? (
                transactions.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-bali-ink)]/70">
                      {format(tx.timestamp, 'dd MMM yyyy, HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--color-bali-ink)]">
                      {tx.keterangan}
                    </td>
                    <td className="px-6 py-4">
                      <Badge type={tx.isIncome ? 'income' : 'expense'}>
                        {tx.isIncome ? 'Pemasukan' : 'Pengeluaran'}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${tx.isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.isIncome ? '+' : '-'}{formatIDR(tx.nominal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-bali-ink)]/50">
                    Belum ada transaksi yang tercatat di blockchain.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
