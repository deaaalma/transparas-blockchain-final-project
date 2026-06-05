import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain, type Transaction } from '../hooks/useBlockchain';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/ToastContext';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { RefreshCcw, FileText, Search, Calendar, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

const idr = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

function StatusBadge({ status }: { status: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border-strong)', color: 'var(--color-income)' }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-income)' }} />
      {status}
    </div>
  );
}

export default function TransactionPage() {
  const navigate = useNavigate();
  const { getTransactions, isConnected } = useBlockchain();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      // Sort by newest first
      const sorted = [...data].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTransactions(sorted);
    } catch (err) {
      console.error(err);
      toast("Gagal memuat riwayat transaksi", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const parseDescription = (raw: string) => {
    const matchCat = raw.match(/^\[(.*?)\]\s*/);
    let category = matchCat ? matchCat[1] : '';
    let desc = raw;
    
    if (matchCat) {
      desc = raw.substring(matchCat[0].length);
    } else {
      const lower = raw.toLowerCase();
      if (lower.includes('server') || lower.includes('cloud') || lower.includes('it')) category = 'IT Infrastructure';
      else if (lower.includes('rapat') || lower.includes('konsumsi')) category = 'Operasional';
      else if (lower.includes('punia') || lower.includes('donasi') || lower.includes('dana')) category = 'Pemasukan';
      else if (lower.includes('banten') || lower.includes('upacara')) category = 'Keagamaan';
      else category = 'Operasional';
    }

    const matchIpfs = desc.match(/\|\s*(ipfs:\/\/[^\s]+)$/);
    let ipfsUrl = null;
    if (matchIpfs) {
      ipfsUrl = matchIpfs[1];
      desc = desc.substring(0, matchIpfs.index).trim();
    }

    return { category, desc, ipfsUrl };
  };

  useEffect(() => {
    document.title = 'Transactions | TransParas';
    if (isConnected) {
      fetchTransactions();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleRefresh = async () => {
    await fetchTransactions();
    toast("Data transaksi berhasil diperbarui", "success");
  };

  const filteredTransactions = transactions.filter(tx => {
    // 1. Type filter
    if (filterType === 'income' && !tx.isIncome) return false;
    if (filterType === 'expense' && tx.isIncome) return false;
    
    // 2. Search filter (Description, Wallet, or ID)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !tx.keterangan.toLowerCase().includes(q) &&
        !tx.addedBy.toLowerCase().includes(q) &&
        !tx.id.toString().includes(q)
      ) {
        return false;
      }
    }

    // 3. Date Range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (tx.timestamp < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (tx.timestamp > end) return false;
    }

    return true;
  });

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Transaction History
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Daftar lengkap seluruh pemasukan dan pengeluaran organisasi yang tercatat di dalam blockchain
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 rounded-xl h-[34px]">
            <RefreshCcw size={14} />
            Refresh
          </Button>
        </div>

        {/* Search and Filter Bar */}
        {isConnected && transactions.length > 0 && (
          <div className="flex items-center gap-3 w-full relative">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Cari berdasarkan deskripsi atau ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-bg-card)] border border-[var(--color-border-strong)] rounded-xl py-2 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-orange-dim)] transition-colors"
              />
            </div>

            {/* Filter Dropdown Button */}
            <div className="relative" ref={filterRef}>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 rounded-xl h-[38px] bg-[var(--color-bg-card)]"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={16} />
                Filter
                {(filterType !== 'all' || startDate || endDate) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--color-brand-orange)] shadow-md" />
                )}
              </Button>

              {/* Filter Dropdown Content */}
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">Filter Transaksi</h3>
                  
                  {/* Date Range */}
                  <div className="space-y-3 mb-6">
                    <label className="text-[11px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Rentang Waktu</label>
                    <div className="flex flex-col gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-lg py-2 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange-dim)] [color-scheme:dark]"
                      />
                      <div className="text-center text-[var(--color-text-muted)] text-[11px] font-medium uppercase tracking-widest">Hingga</div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-lg py-2 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange-dim)] [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="text-[11px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">Tipe Transaksi</label>
                    <div className="flex items-center bg-[var(--color-bg-input)] rounded-lg p-1 border border-[var(--color-border)] w-full">
                      {(['all', 'income', 'expense'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setFilterType(type)}
                          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                            filterType === type 
                              ? 'bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]' 
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-transparent'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[var(--color-border-strong)]">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-9 px-5 rounded-xl"
                      onClick={() => {
                        setFilterType('all');
                        setStartDate('');
                        setEndDate('');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Filter Badges */}
        {(filterType !== 'all' || startDate || endDate) && (
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-medium text-[var(--color-text-muted)] mr-1">Filter Aktif:</span>
            
            {filterType !== 'all' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] shadow-sm text-xs text-[var(--color-text-primary)]">
                <span className="capitalize"><span className="text-[var(--color-text-muted)] mr-1">Tipe:</span>{filterType}</span>
                <button onClick={() => setFilterType('all')} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}
            
            {(startDate || endDate) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] shadow-sm text-xs text-[var(--color-text-primary)]">
                <span><span className="text-[var(--color-text-muted)] mr-1">Tanggal:</span>{startDate || 'Apa saja'} - {endDate || 'Apa saja'}</span>
                <button onClick={() => { setStartDate(''); setEndDate(''); }} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                  <X size={12} />
                </button>
              </div>
            )}

            <button 
              onClick={() => { setFilterType('all'); setStartDate(''); setEndDate(''); }}
              className="text-[11px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] underline underline-offset-2 ml-1 transition-colors"
            >
              Hapus semua
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!isConnected ? (
        <EmptyState
          icon={<FileText size={24} />}
          title="Dompet Belum Terhubung"
          description="Silakan hubungkan dompet digital Anda (MetaMask) untuk melihat riwayat transaksi."
        />
      ) : isLoading ? (
        // Loading Skeleton
        <div className="space-y-4">
          <Skeleton className="w-full h-12" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </div>
      ) : transactions.length === 0 ? (
        // Empty State
        <EmptyState
          icon={<FileText size={24} />}
          title="Belum Ada Transaksi"
          description="Belum ada transaksi yang tercatat di dalam blockchain saat ini. Catatan baru akan muncul di sini."
        />
      ) : filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<Search size={24} />}
          title="Tidak Ada Hasil"
          description="Kami tidak menemukan transaksi yang cocok dengan filter pencarian Anda."
          action={
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setFilterType('all');
                setSearchQuery('');
                setStartDate('');
                setEndDate('');
              }} 
              className="mt-2 rounded-xl"
            >
              Hapus Filter
            </Button>
          }
        />
      ) : (
        // Data Table
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tx ID</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Nominal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow 
                key={tx.id}
                onClick={() => navigate(`/transaksi/${tx.id}`)}
                className="cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors group"
              >
                <TableCell className="font-mono text-xs text-[var(--color-text-muted)] font-medium group-hover:text-[var(--color-brand-orange)] transition-colors">
                  #{tx.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border" style={{ background: 'var(--color-bg-card-hover)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border-strong)' }}>
                        {parseDescription(tx.keterangan).category}
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {parseDescription(tx.keterangan).desc}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-[var(--color-text-muted)] font-mono">
                        By: {tx.addedBy.substring(0, 6)}...{tx.addedBy.substring(38)}
                      </div>
                      {parseDescription(tx.keterangan).ipfsUrl && (
                        <a 
                          href={parseDescription(tx.keterangan).ipfsUrl!.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] font-semibold text-[var(--color-brand-orange)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Lihat Bukti
                        </a>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-[var(--color-text-secondary)]">
                  {format(tx.timestamp, 'dd MMM yyyy HH:mm', { locale: idLocale })}
                </TableCell>
                <TableCell>
                  <StatusBadge status="Verified" />
                </TableCell>
                <TableCell
                  className="text-right font-semibold tabular-nums"
                  style={{ color: tx.isIncome ? 'var(--color-income)' : 'var(--color-expense)' }}
                >
                  {tx.isIncome ? '+' : '-'}{idr(tx.nominal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
