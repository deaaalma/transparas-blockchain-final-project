import { useState } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Download, FileText, FileSpreadsheet, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/ToastContext';
import { type Transaction } from '../../hooks/useBlockchain';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const idr = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export function ExportModal({ isOpen, onClose, transactions }: ExportModalProps) {
  const { toast } = useToast();
  
  // Local state for export filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  if (!isOpen) return null;

  // Filter Logic specifically for export
  const filteredData = transactions.filter(tx => {
    if (filterType === 'income' && !tx.isIncome) return false;
    if (filterType === 'expense' && tx.isIncome) return false;
    
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

  const totalIncome = filteredData.filter(tx => tx.isIncome).reduce((sum, tx) => sum + tx.nominal, 0);
  const totalExpense = filteredData.filter(tx => !tx.isIncome).reduce((sum, tx) => sum + tx.nominal, 0);
  const netBalance = totalIncome - totalExpense;

  const parseDescription = (raw: string) => {
    const matchCat = raw.match(/^\[(.*?)\]\s*/);
    let category = matchCat ? matchCat[1] : 'Umum';
    let desc = raw;
    if (matchCat) desc = raw.substring(matchCat[0].length);
    
    const matchIpfs = desc.match(/\|\s*(ipfs:\/\/[^\s]+)$/);
    if (matchIpfs) {
      desc = desc.substring(0, matchIpfs.index).trim();
    }
    return { category, desc };
  };

  const exportPDF = () => {
    const doc = new jsPDF('landscape');
    const isIncomeOnly = filterType === 'income';
    const isExpenseOnly = filterType === 'expense';
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    
    let titleBase = 'LAPORAN KEUANGAN';
    if (isIncomeOnly) titleBase = 'LAPORAN PEMASUKAN';
    if (isExpenseOnly) titleBase = 'LAPORAN PENGELUARAN';
    
    let title = `${titleBase} TRANSPARAS`;
    
    let periodText = 'Periode: Semua Waktu';
    if (startDate || endDate) {
      const startStr = startDate ? format(new Date(startDate), 'dd MMMM yyyy', { locale: idLocale }) : 'Awal';
      const endStr = endDate ? format(new Date(endDate), 'dd MMMM yyyy', { locale: idLocale }) : 'Sekarang';
      periodText = `Periode: ${startStr} - ${endStr}`;
      title = `${titleBase} RENTANG ${startStr.toUpperCase()} - ${endStr.toUpperCase()}`;
    }

    doc.text(title, 14, 22);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Dicetak pada: ' + format(new Date(), 'dd MMMM yyyy HH:mm', { locale: idLocale }), 14, 30);
    doc.text(periodText, 14, 36);

    let currentBalance = 0;
    const chronologicalData = [...filteredData].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const tableData = chronologicalData.map(tx => {
      const { category, desc } = parseDescription(tx.keterangan);
      const debit = tx.isIncome ? tx.nominal : 0;
      const kredit = !tx.isIncome ? tx.nominal : 0;
      currentBalance += tx.isIncome ? tx.nominal : -tx.nominal;
      
      const dateStr = format(tx.timestamp, 'dd/MM/yyyy HH:mm', { locale: idLocale });
      
      if (isIncomeOnly) {
        return [dateStr, `#${tx.id}`, desc, category, idr(debit)];
      } else if (isExpenseOnly) {
        return [dateStr, `#${tx.id}`, desc, category, idr(kredit)];
      } else {
        return [dateStr, `#${tx.id}`, desc, category, debit > 0 ? idr(debit) : '-', kredit > 0 ? idr(kredit) : '-', idr(currentBalance)];
      }
    });

    let head = [['Tanggal', 'ID', 'Keterangan', 'Ref/Kategori', 'Pemasukan (Debit)', 'Pengeluaran (Kredit)', 'Saldo']];
    let columnStyles: any = {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' }
    };
    
    if (isIncomeOnly) {
      head = [['Tanggal', 'ID', 'Keterangan', 'Ref/Kategori', 'Nominal Pemasukan']];
      columnStyles = { 4: { halign: 'right', fontStyle: 'bold' } };
    } else if (isExpenseOnly) {
      head = [['Tanggal', 'ID', 'Keterangan', 'Ref/Kategori', 'Nominal Pengeluaran']];
      columnStyles = { 4: { halign: 'right', fontStyle: 'bold' } };
    }

    autoTable(doc, {
      startY: 45,
      head,
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255] },
      columnStyles,
      styles: { fontSize: 9 }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 45;
    
    doc.setFontSize(10);
    if (isIncomeOnly) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Pemasukan: ${idr(totalIncome)}`, 14, finalY + 10);
    } else if (isExpenseOnly) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Pengeluaran: ${idr(totalExpense)}`, 14, finalY + 10);
    } else {
      doc.text(`Total Pemasukan: ${idr(totalIncome)}`, 14, finalY + 10);
      doc.text(`Total Pengeluaran: ${idr(totalExpense)}`, 14, finalY + 16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Saldo Akhir: ${idr(netBalance)}`, 14, finalY + 22);
    }

    doc.save(`Laporan_TransParas_${format(new Date(), 'yyyyMMdd_HHmm')}.pdf`);
    toast('PDF berhasil diunduh', 'success');
    onClose();
  };

  const exportCSV = () => {
    let currentBalance = 0;
    const chronologicalData = [...filteredData].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const isIncomeOnly = filterType === 'income';
    const isExpenseOnly = filterType === 'expense';
    
    let headers = ['Tanggal', 'ID', 'Keterangan', 'Ref/Kategori', 'Pemasukan (Debit)', 'Pengeluaran (Kredit)', 'Saldo'];
    if (isIncomeOnly) headers = ['Tanggal', 'ID', 'Keterangan', 'Ref/Kategori', 'Nominal Pemasukan'];
    if (isExpenseOnly) headers = ['Tanggal', 'ID', 'Keterangan', 'Ref/Kategori', 'Nominal Pengeluaran'];
    
    const csvRows = [headers.join(',')];
    
    for (const tx of chronologicalData) {
      const { category, desc } = parseDescription(tx.keterangan);
      const debit = tx.isIncome ? tx.nominal : 0;
      const kredit = !tx.isIncome ? tx.nominal : 0;
      currentBalance += tx.isIncome ? tx.nominal : -tx.nominal;
      
      const tanggalStr = format(tx.timestamp, 'dd/MM/yyyy HH:mm', { locale: idLocale });
      const safeDesc = `"${desc.replace(/"/g, '""')}"`;
      const safeCat = `"${category}"`;
      
      let values = [];
      if (isIncomeOnly) {
        values = [tanggalStr, tx.id, safeDesc, safeCat, debit];
      } else if (isExpenseOnly) {
        values = [tanggalStr, tx.id, safeDesc, safeCat, kredit];
      } else {
        values = [tanggalStr, tx.id, safeDesc, safeCat, debit, kredit, currentBalance];
      }
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_TransParas_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast('CSV berhasil diunduh', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] rounded-2xl p-6 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Download size={24} className="text-[var(--color-brand-orange)]" />
              Ekspor Laporan Keuangan
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              Saring data transaksi dan unduh laporan resmi untuk keperluan audit.
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-2 bg-[var(--color-bg-input)] rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Filters Card */}
          <div className="lg:col-span-2 bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-strong)] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">Filter Data Ekspor</h2>
              {(startDate || endDate || filterType !== 'all') && (
                <button 
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setFilterType('all');
                  }}
                  className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-brand-orange)] transition-colors underline underline-offset-2"
                >
                  Reset Filter
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Rentang Waktu</label>
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

              <div>
                <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Tipe Transaksi</label>
                <div className="flex flex-col gap-2">
                  {(['all', 'income', 'expense'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${
                        filterType === type 
                          ? 'bg-[var(--color-brand-orange-dim)] text-[var(--color-brand-orange)] border border-[var(--color-brand-orange)]' 
                          : 'bg-[var(--color-bg-input)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-surface)]'
                      }`}
                    >
                      {type === 'all' ? 'Semua Tipe' : type === 'income' ? 'Pemasukan (Debit)' : 'Pengeluaran (Kredit)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Download Actions Card */}
          <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border-strong)] p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">Tindakan</h2>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                Terdapat <strong>{filteredData.length} transaksi</strong> siap diunduh berdasarkan filter.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={exportPDF} disabled={filteredData.length === 0} className="w-full gap-2 justify-center h-11 rounded-xl">
                <FileText size={18} />
                Format PDF
              </Button>
              <Button onClick={exportCSV} variant="outline" disabled={filteredData.length === 0} className="w-full gap-2 justify-center h-11 rounded-xl bg-[var(--color-bg-card)]">
                <FileSpreadsheet size={18} />
                Format CSV
              </Button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
