import React, { useState } from 'react';
import { useWallet } from '../features/blockchain/WalletContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Send } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TambahTransaksi() {
  const { isConnected, isOwner, addTransaction, connectWallet } = useWallet();
  const navigate = useNavigate();
  
  const [keterangan, setKeterangan] = useState('');
  const [nominal, setNominal] = useState('');
  const [isIncome, setIsIncome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!keterangan.trim()) {
      setError('Keterangan tidak boleh kosong');
      return;
    }
    
    const nominalNum = Number(nominal);
    if (isNaN(nominalNum) || nominalNum <= 0) {
      setError('Nominal harus lebih besar dari 0');
      return;
    }

    setIsLoading(true);
    try {
      await addTransaction(keterangan, nominalNum, isIncome);
      alert('Transaksi berhasil ditambahkan ke blockchain!');
      navigate('/'); // Kembali ke dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.reason || err.message || 'Gagal menambahkan transaksi. Pastikan saldo mencukupi jika ini pengeluaran.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected || !isOwner) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-[var(--color-bali-maroon)] mb-2">Akses Ditolak</h2>
          <p className="text-[var(--color-bali-ink)]/70">Hanya Bendahara (Pemilik Kontrak) yang dapat mengakses halaman ini.</p>
        </div>
        {!isConnected ? (
          <Button onClick={connectWallet} variant="primary">Hubungkan Dompet MetaMask</Button>
        ) : (
          <Link to="/">
            <Button variant="outline">Kembali ke Dashboard</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-bali-ink)]/60 hover:text-[var(--color-bali-maroon)] transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </div>

      <Card className="p-0 overflow-hidden shadow-lg border-none ring-1 ring-black/5">
        <div className="p-6 bg-gradient-to-r from-[var(--color-bali-maroon)] to-[var(--color-bali-maroon-dark)] text-white">
          <h1 className="text-2xl font-serif font-bold">Catat Transaksi Baru</h1>
          <p className="text-white/80 text-sm mt-1">Data akan dicatat secara permanen di Polygon Blockchain</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-bali-ink)] mb-2">
                Jenis Transaksi
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIsIncome(true)}
                  className={`py-3 px-4 rounded-lg font-medium text-sm transition-all border-2 cursor-pointer ${
                    isIncome 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Pemasukan (Dana Punia)
                </button>
                <button
                  type="button"
                  onClick={() => setIsIncome(false)}
                  className={`py-3 px-4 rounded-lg font-medium text-sm transition-all border-2 cursor-pointer ${
                    !isIncome 
                      ? 'border-rose-500 bg-rose-50 text-rose-700' 
                      : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Pengeluaran (Biaya)
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="nominal" className="block text-sm font-medium text-[var(--color-bali-ink)] mb-2">
                Nominal (IDR)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">Rp</span>
                </div>
                <input
                  type="number"
                  id="nominal"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-bali-gold)] focus:border-transparent outline-none transition-shadow"
                  placeholder="Contoh: 500000"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="keterangan" className="block text-sm font-medium text-[var(--color-bali-ink)] mb-2">
                Keterangan Transaksi
              </label>
              <textarea
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={3}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-bali-gold)] focus:border-transparent outline-none transition-shadow resize-none"
                placeholder="Contoh: Dana punia dari warga Banjar A"
                disabled={isLoading}
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-3 flex items-center justify-center gap-2 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memproses ke Blockchain...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Simpan ke Blockchain
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
