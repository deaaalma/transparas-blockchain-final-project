import { useEffect, useState } from 'react';
import { useBlockchain, type Transaction } from '../hooks/useBlockchain';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/ToastContext';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { RefreshCcw, FileText } from 'lucide-react';
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
  const { getTransactions, isConnected } = useBlockchain();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      // Sort by newest first
      const sorted = [...data].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTransactions(sorted);
    } catch (err) {
      console.error(err);
      toast("Failed to load transactions", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Transactions | TransParas';
    if (isConnected) {
      fetchTransactions();
    } else {
      setIsLoading(false);
    }
  }, [isConnected]);

  const handleRefresh = async () => {
    await fetchTransactions();
    toast("Transaction data refreshed successfully", "success");
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Transaction History
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Complete list of all organizational income and expenses recorded on the blockchain
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 rounded-xl">
          <RefreshCcw size={16} />
          Refresh
        </Button>
      </div>

      {/* Main Content Area */}
      {!isConnected ? (
        <EmptyState
          icon={<FileText size={24} />}
          title="Wallet Not Connected"
          description="Please connect your wallet using the button in the top right corner to view transaction history."
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
          title="No Transactions Yet"
          description="There are no transactions recorded on the blockchain right now. New records will appear here."
        />
      ) : (
        // Data Table
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, idx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-medium text-[var(--color-text-muted)]">
                  {transactions.length - idx}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-[var(--color-text-primary)]">
                    {tx.keterangan}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] mt-0.5 font-mono">
                    By: {tx.addedBy.substring(0, 6)}...{tx.addedBy.substring(38)}
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
