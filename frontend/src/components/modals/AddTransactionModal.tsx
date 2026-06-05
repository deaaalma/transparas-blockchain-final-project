import React, { useState, useEffect } from 'react';
import { useWallet } from '../../features/blockchain/WalletContext';
import { useToast } from '../ui/ToastContext';
import { uploadToIPFS } from '../../utils/ipfs';
import { format } from 'date-fns';
import { X, UploadCloud, Lock, Send, AlertTriangle, CheckCircle2, Loader2, FileText } from 'lucide-react';

const INCOME_CATEGORIES = ['Dana Punia', 'Iuran Anggota', 'Donasi', 'Lainnya'];
const EXPENSE_CATEGORIES = ['Keagamaan', 'Sosial', 'Operasional', 'Konsumsi', 'Infrastruktur', 'Dana Darurat', 'Lainnya'];

interface AddTransactionModalProps {
  onClose: () => void;
}

export function AddTransactionModal({ onClose }: AddTransactionModalProps) {
  const { isConnected, isOwner, addTransaction } = useWallet();
  const { toast } = useToast();
  
  const [isIncome, setIsIncome] = useState(true);
  const [kategori, setKategori] = useState(INCOME_CATEGORIES[0]);
  const [keterangan, setKeterangan] = useState('');
  const [nominal, setNominal] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('Menunggu Konfirmasi');
  const [error, setError] = useState('');

  // Update default category when type changes
  useEffect(() => {
    setKategori(isIncome ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }, [isIncome]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!keterangan.trim()) {
      setError('Keterangan tidak boleh kosong.');
      return;
    }
    
    const nominalNum = Number(nominal);
    if (isNaN(nominalNum) || nominalNum <= 0) {
      setError('Nominal harus lebih besar dari 0.');
      return;
    }

    setIsLoading(true);
    setStatusText('Mengunggah file ke IPFS...');
    
    try {
      let ipfsUrl = '';
      if (file) {
        ipfsUrl = await uploadToIPFS(file);
      }
      
      setStatusText('Menunggu persetujuan MetaMask...');
      
      // Format the description: [Category] Actual description | ipfs://...
      let finalKeterangan = `[${kategori}] ${keterangan}`;
      if (ipfsUrl) {
        finalKeterangan += ` | ${ipfsUrl}`;
      }
      
      await addTransaction(finalKeterangan, nominalNum, isIncome);
      
      setStatusText('Transaksi Berhasil!');
      toast('Transaksi berhasil dicatat di blockchain', 'success');
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.reason || err.message || 'Gagal menambahkan transaksi. Pastikan saldo mencukupi.');
      setStatusText('Menunggu Konfirmasi');
    } finally {
      setIsLoading(false);
    }
  };

  // If not owner, don't allow
  if (!isOwner) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-[var(--color-bg-card)] max-w-md w-full rounded-2xl shadow-2xl p-6 text-center relative border border-[var(--color-border-strong)]">
          <button onClick={onClose} className="absolute right-4 top-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-[var(--color-expense-dim)] text-[var(--color-expense)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Akses Ditolak</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">Hanya Bendahara (Pemilik Kontrak) yang diizinkan untuk mencatat transaksi baru.</p>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-bg-surface)] transition-colors">
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--color-bg-base)] max-w-5xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[95vh] border border-[var(--color-border-strong)]">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-[var(--color-border-strong)] flex items-center justify-between shrink-0 bg-[var(--color-bg-card)] rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Tambah Transaksi Baru</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Catat transaksi dana organisasi dan amankan ke dalam blockchain</p>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-2 rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors" disabled={isLoading}>
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-strong)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-5">Detail Transaksi</h3>
              
              {error && (
                <div className="mb-6 bg-[var(--color-expense-dim)] border border-[var(--color-expense)] rounded-xl p-4 flex items-start gap-3 text-sm text-[var(--color-expense)] leading-relaxed">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form id="add-tx-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  {/* Tanggal (Disabled, auto generated by blockchain but we show current date as UX) */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Tanggal</label>
                    <input 
                      type="text" 
                      value={format(new Date(), 'dd/MM/yyyy')} 
                      disabled 
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-muted)] font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Jenis Transaksi */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Jenis Transaksi</label>
                    <div className="flex rounded-xl border border-[var(--color-border)] p-1 bg-[var(--color-bg-input)]">
                      <button
                        type="button"
                        onClick={() => setIsIncome(true)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          isIncome 
                            ? 'bg-[var(--color-bg-card)] text-[var(--color-income)] shadow-sm border border-[var(--color-border-strong)]' 
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-transparent'
                        }`}
                      >
                        Masuk
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsIncome(false)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          !isIncome 
                            ? 'bg-[var(--color-bg-card)] text-[var(--color-expense)] shadow-sm border border-[var(--color-border-strong)]' 
                            : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-transparent'
                        }`}
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {/* Kategori */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Kategori</label>
                    <select
                      value={kategori}
                      onChange={(e) => setKategori(e.target.value)}
                      className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange-dim)] transition-colors appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      {(isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Nominal */}
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Nominal (IDR)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-[var(--color-text-muted)] font-medium text-sm">Rp</span>
                      </div>
                      <input
                        type="number"
                        value={nominal}
                        onChange={(e) => setNominal(e.target.value)}
                        min="1"
                        className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl pl-12 pr-4 py-3 text-sm text-[var(--color-text-primary)] font-bold focus:outline-none focus:border-[var(--color-brand-orange-dim)] transition-colors placeholder-[var(--color-text-muted)]/50"
                        placeholder="0"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Keterangan Khusus</label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    className="w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange-dim)] transition-colors placeholder-[var(--color-text-muted)]/50"
                    placeholder="Contoh: Donasi perbaikan atap"
                    disabled={isLoading}
                  />
                </div>

                {/* Upload Bukti Transaksi */}
                <div>
                  <label className="block text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Upload Bukti Transaksi</label>
                  <div className="relative border-2 border-dashed border-[var(--color-border-strong)] rounded-2xl p-6 bg-[var(--color-bg-surface)] text-center hover:bg-[var(--color-bg-input)] transition-colors">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg, application/pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-bg-card)] shadow-sm flex items-center justify-center text-[var(--color-text-secondary)]">
                        {file ? <FileText size={20} /> : <UploadCloud size={20} />}
                      </div>
                      {file ? (
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{file.name}</p>
                      ) : (
                        <>
                          <p className="text-sm text-[var(--color-text-primary)]">Drag and drop file di sini, atau <span className="text-[var(--color-brand-orange)] font-semibold">pilih file</span></p>
                          <p className="text-xs text-[var(--color-text-muted)]">Maksimal ukuran file 5MB (JPG, PNG, PDF)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 mt-2 bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> {statusText}</>
                  ) : (
                    <><Lock size={16} /> Simpan ke Blockchain</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: MetaMask Estimation */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-bg-card)] border border-[var(--color-border-strong)] rounded-2xl p-6 shadow-sm sticky top-0">
              
              <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)] mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">MetaMask</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[11px] font-bold tracking-wider uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Estimasi Transaksi</p>
                <div className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                  Rp {nominal ? new Intl.NumberFormat('id-ID').format(Number(nominal)) : '0'}
                </div>
                <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">+ Gas Fee</p>
              </div>

              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] rounded-xl p-4 space-y-3 text-sm mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Kategori</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{kategori}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Jaringan</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">Polygon Amoy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-text-secondary)]">Est. Gas Fee</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">~0.001 MATIC</span>
                </div>
              </div>

              <div className="bg-[var(--color-bg-input)] border border-[var(--color-border)] rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-text-secondary)]">
                {isLoading ? <Loader2 size={16} className="animate-spin text-[var(--color-brand-orange)]" /> : <Loader2 size={16} />}
                Status: {statusText}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
