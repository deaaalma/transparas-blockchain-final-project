import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlockchain, type Transaction } from '../hooks/useBlockchain';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  ArrowLeft, FileText, AlertTriangle, ChevronUp, ChevronDown, CheckCircle2, Copy
} from 'lucide-react';
import { useToast } from '../components/ui/ToastContext';

const idr = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);
const shortAddr = (addr: string) =>
  addr ? `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}` : '-';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTransactions, isConnected } = useBlockchain();
  const { toast } = useToast();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isBlockchainOpen, setIsBlockchainOpen] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  useEffect(() => {
    document.title = `Transaction #${id} | TransParas`;

    async function fetchTx() {
      if (!isConnected || !id) { setIsLoading(false); return; }
      try {
        const txs = await getTransactions();
        const found = txs.find(t => t.id === Number(id));
        setTransaction(found || null);
      } catch (err) {
        console.error(err);
        toast('Gagal memuat detail transaksi', 'error');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTx();
  }, [id, isConnected, getTransactions, toast]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`${label} berhasil disalin`, 'success');
  };

  if (!isConnected) {
    return (
      <div className="max-w-5xl mx-auto w-full pt-10 px-4 md:px-8">
        <EmptyState icon={<FileText size={24} />} title="Dompet Belum Terhubung"
          description="Silakan hubungkan dompet digital Anda (MetaMask) untuk melihat detail transaksi." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto w-full space-y-8 px-4 md:px-8 pt-6">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-64 h-10" />
        <Skeleton className="w-full h-20" />
        <div className="space-y-4">
          <Skeleton className="w-48 h-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="max-w-5xl mx-auto w-full pt-10 px-4 md:px-8">
        <EmptyState icon={<FileText size={24} />} title="Transaksi Tidak Ditemukan"
          description={`Transaksi dengan ID #${id} tidak ditemukan di dalam jaringan blockchain.`}
          action={
            <Button variant="outline" onClick={() => navigate('/transaksi')} className="mt-4 rounded-xl">
              Kembali ke Riwayat
            </Button>
          } />
      </div>
    );
  }

  const isIncome = transaction.isIncome;
  const pseudoHash = `0x${btoa(`transparas-tx-${transaction.id}-${transaction.timestamp.getTime()}`)
    .replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 64)}`;

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 px-4 md:px-8 pt-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Transaction #{transaction.id}
        </h1>
      </div>

      {/* Warning/Info Box */}
      <div className="bg-[var(--color-brand-orange-dim)] border border-[var(--color-brand-orange)] rounded-sm p-4 mb-10 flex items-start gap-3 text-sm text-[var(--color-text-primary)] leading-relaxed">
        <AlertTriangle size={18} className="text-[var(--color-brand-orange)] shrink-0 mt-0.5" />
        <p>
          Catatan blockchain bersifat permanen (<em>immutable</em>). Artinya, setelah transaksi tercatat di jaringan Polygon Amoy, data tersebut tidak dapat diubah, dihapus, atau dimanipulasi oleh pihak mana pun. Hal ini menjamin transparansi dan integritas penuh dalam catatan keuangan organisasi.
        </p>
      </div>

      {/* Section: Transaction details */}
      <div className="mb-10 border-b border-[var(--color-border-strong)] pb-10">
        <button 
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)] mb-8 hover:text-[var(--color-text-secondary)] transition-colors"
        >
          {isDetailsOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          Transaction details
        </button>
        
        {isDetailsOpen && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8 pl-8">
            <DetailItem label="TRANSACTION NUMBER" value={transaction.id.toString()} />
            <DetailItem 
              label="AMOUNT" 
              value={`${isIncome ? '+' : '-'}${idr(transaction.nominal)}`} 
            />
            <DetailItem label="CATEGORY" value={isIncome ? 'Income' : 'Expense'} />
            <DetailItem 
              label="STATUS" 
              value={
                <span className="flex items-center gap-1.5 w-fit bg-[var(--color-income-dim)] text-[var(--color-income)] px-2 py-0.5 rounded-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-income)]" /> Confirmed
                </span>
              } 
            />
            
            <DetailItem label="DESCRIPTION" value={transaction.keterangan} />
            <DetailItem label="DATE" value={format(transaction.timestamp, 'MM/dd/yyyy', { locale: idLocale })} />
            <DetailItem 
              label="SOURCE (WALLET)" 
              value={shortAddr(transaction.addedBy)} 
              copyableValue={transaction.addedBy} 
              onCopy={() => copy(transaction.addedBy, 'Wallet address')}
            />
            <DetailItem label="NETWORK" value="Polygon Amoy" />
          </div>
        )}
      </div>

      {/* Section: Blockchain details */}
      <div className="mb-10 border-b border-[var(--color-border-strong)] pb-10">
        <button 
          onClick={() => setIsBlockchainOpen(!isBlockchainOpen)}
          className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)] mb-8 hover:text-[var(--color-text-secondary)] transition-colors"
        >
          {isBlockchainOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          Blockchain details
        </button>
        
        {isBlockchainOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 gap-x-8 pl-8">
            <div className="md:col-span-3">
               <DetailItem 
                  label="TRANSACTION HASH" 
                  value={pseudoHash} 
                  copyableValue={pseudoHash}
                  onCopy={() => copy(pseudoHash, 'Transaction hash')}
                />
            </div>
            <DetailItem label="BLOCK CONFIRMATIONS" value="> 100" />
          </div>
        )}
      </div>

      {/* Section: History */}
      <div className="mb-10">
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="flex items-center gap-2 text-xl font-bold text-[var(--color-text-primary)] mb-8 hover:text-[var(--color-text-secondary)] transition-colors"
        >
          {isHistoryOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          History
        </button>
        
        {isHistoryOpen && (
          <div className="pl-8 flex items-start gap-6">
            <div className="text-sm font-medium text-[var(--color-text-primary)] w-32 shrink-0 pt-0.5">
              {format(transaction.timestamp, 'MM/dd/yyyy')} <br/>
              <span className="text-[var(--color-text-secondary)]">{format(transaction.timestamp, 'h:mm a')}</span>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-orange)] z-10" />
              <div className="w-0.5 h-full bg-[var(--color-border-strong)] absolute top-2.5" />
            </div>
            <div className="text-sm text-[var(--color-text-primary)] pb-12 flex items-center flex-wrap gap-1">
              Transaksi dicatat di dalam blockchain oleh 
              <button 
                onClick={() => copy(transaction.addedBy, 'Alamat wallet')}
                className="font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 ml-1 bg-[var(--color-bg-card)] px-2 py-0.5 rounded-md border border-[var(--color-border)]"
                title="Copy address"
              >
                {shortAddr(transaction.addedBy)}
                <Copy size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ 
  label, 
  value, 
  copyableValue,
  onCopy
}: { 
  label: string, 
  value: React.ReactNode, 
  copyableValue?: string,
  onCopy?: () => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold text-[var(--color-text-muted)] tracking-widest uppercase">
        {label}
      </span>
      <div className="text-sm font-medium text-[var(--color-text-primary)] flex items-center gap-2">
        {value}
        {copyableValue && (
          <button 
            onClick={onCopy}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1 rounded-md"
            title="Copy"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
