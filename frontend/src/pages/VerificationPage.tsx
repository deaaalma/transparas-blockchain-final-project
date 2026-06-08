import { useState, useRef } from 'react';
import { useWallet } from '../features/blockchain/WalletContext';
import type { Transaction } from '../hooks/useBlockchain';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { 
  Search, ShieldCheck, Printer, ExternalLink, 
  AlertCircle, CheckCircle2, Copy, FileText, Fingerprint
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// ─── helpers ──────────────────────────────────────────────────────────────────
const idr = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n);
const formatDateTime = (d: Date) => format(d, "dd MMMM yyyy, HH:mm:ss 'WIB'", { locale: idLocale });

export default function VerificationPage() {
  const { getTransactions, isConnected } = useWallet();
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Transaction | null>(null);
  const [error, setError] = useState('');
  
  // Fake progress steps for the "Hacking/Searching" effect
  const [searchStep, setSearchStep] = useState(0);

  const printRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setResult(null);
    setError('');
    setSearchStep(1);

    try {
      // Simulate blockchain lookup delay for dramatic effect
      await new Promise(r => setTimeout(r, 800));
      setSearchStep(2);
      await new Promise(r => setTimeout(r, 800));
      setSearchStep(3);
      
      const txs = await getTransactions();
      const targetId = Number(searchId);
      
      // Simulate final check
      await new Promise(r => setTimeout(r, 600));

      const found = txs.find(t => t.id === targetId);
      if (found) {
        setResult(found);
      } else {
        setError(`Transaksi dengan ID #${targetId} tidak ditemukan atau belum tercatat di Blockchain.`);
      }
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke jaringan Blockchain Polygon Amoy. Pastikan koneksi stabil.");
    } finally {
      setIsSearching(false);
      setSearchStep(0);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate a mock hash based on ID to look professional
  const mockTxHash = result ? `0x${Math.abs(Math.sin(result.id) * 1e16).toString(16)}...${(result.timestamp.getTime() % 10000).toString(16)}` : '';
  const explorerUrl = `https://amoy.polygonscan.com/address/0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62`;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-7 py-8 custom-scrollbar relative">
      {/* ─── PRINT ONLY STYLES ─── */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #print-area, #print-area * { visibility: visible; }
            #print-area {
              position: absolute;
              left: 0; top: 0; width: 100%;
              padding: 20px; margin: 0;
              color: black !important;
              font-family: "Times New Roman", Times, serif !important;
            }
            #print-area p, #print-area h2, #print-area span, #print-area div {
              color: black !important;
              font-weight: normal !important;
              font-size: 12pt !important;
              background: transparent !important;
              letter-spacing: normal !important;
            }
            #print-area .badge-color { border: none !important; padding: 0 !important; }
            #print-area .print-light-border { border: none !important; border-bottom: 1px solid #000 !important; border-radius: 0 !important; }
            #print-area .nominal-amount { white-space: nowrap !important; }
            #print-area svg { width: 100px !important; height: 100px !important; }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* ─── HEADER ─── */}
      <div className="mb-10 max-w-3xl mx-auto text-center no-print">
        <h1 className="text-3xl md:text-4xl text-[var(--color-text-primary)] tracking-tight mb-4" style={{ fontWeight: 'var(--fw-extrabold)' }}>
          Verifikasi Transparansi Data
        </h1>
        <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
          Cek keaslian transaksi secara real-time. Semua data dijamin 100% akurat, transparan, dan tidak dapat dimanipulasi karena telah terekam secara permanen di jaringan Polygon Blockchain.
        </p>
      </div>

      {/* ─── SEARCH BAR ─── */}
      <div className="max-w-xl w-full mx-auto mb-12 no-print">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="absolute left-4 text-[var(--color-text-muted)] pointer-events-none">
            <Search size={20} />
          </div>
          <input
            type="number"
            placeholder="Masukkan ID Transaksi (Contoh: 1)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            disabled={isSearching}
            className="w-full h-14 pl-12 pr-32 rounded-2xl border text-lg bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange)] transition-all"
            style={{ borderColor: 'var(--color-border-strong)' }}
          />
          <button
            type="submit"
            disabled={isSearching || !searchId.trim()}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--color-brand-orange)' }}
          >
            {isSearching ? 'Mencari...' : 'Verifikasi'}
          </button>
        </form>

        {/* Loading Steps */}
        {isSearching && (
          <div className="mt-6 flex flex-col gap-2 max-w-sm mx-auto text-xs font-mono text-[var(--color-text-muted)] animate-pulse">
            <p className={searchStep >= 1 ? "text-[var(--color-brand-orange)]" : ""}>&gt; Menghubungkan ke Polygon Amoy RPC...</p>
            <p className={searchStep >= 2 ? "text-[var(--color-brand-orange)]" : ""}>&gt; Membaca Smart Contract KasOrganisasi...</p>
            <p className={searchStep >= 3 ? "text-[var(--color-brand-orange)]" : ""}>&gt; Mengekstrak Block Data untuk ID #{searchId}...</p>
          </div>
        )}

        {/* Error Message */}
        {error && !isSearching && (
          <div className="mt-6 flex flex-col items-center text-center p-6 rounded-2xl border border-[var(--color-expense)]/30 bg-[var(--color-expense)]/10 text-[var(--color-expense)]">
            <AlertCircle size={32} className="mb-2" />
            <p className="font-semibold text-sm">{error}</p>
            <p className="text-xs mt-1 opacity-80">Pastikan ID yang dimasukkan sudah benar atau tanyakan kepada bendahara.</p>
          </div>
        )}
      </div>

      {/* ─── RESULT CARD (CERTIFICATE) ─── */}
      {result && !isSearching && (
        <div className="max-w-3xl w-full mx-auto" id="print-area">
          <div className="rounded-[22px] border p-8 md:p-10 print-light-border" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
              
              {/* Certificate Header */}
              <div className="flex flex-col md:flex-row print:flex-row justify-between items-start gap-6 border-b pb-8 mb-8 print-light-border" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex-1">
                  <div className="mb-2 text-[var(--color-text-secondary)]">
                    <span className="text-sm font-bold tracking-widest uppercase">Verified On-Chain</span>
                  </div>
                  <h2 className="text-3xl text-[var(--color-text-primary)] tracking-tight" style={{ fontWeight: 'var(--fw-extrabold)' }}>
                    Sertifikat Transaksi
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1 font-mono">
                    ID Transaksi: #{result.id} • TransParas
                  </p>
                </div>

                {/* QR Code */}
                <a 
                  href={explorerUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-3 bg-white rounded-xl shadow-sm shrink-0 border ml-auto print:ml-auto print-light-border transition-transform hover:scale-105 hover:shadow-md block" 
                  style={{ borderColor: 'var(--color-border)' }}
                  title="Klik untuk membuka tautan verifikasi"
                >
                  <QRCodeSVG 
                    value={explorerUrl} 
                    size={90} 
                    level="L" 
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                  <p className="text-center text-[8px] font-mono text-black mt-2 font-bold">SCAN TO VERIFY</p>
                </a>
              </div>

              {/* Certificate Body */}
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 mb-8">
                
                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1 font-bold">Keterangan Transaksi</p>
                    <p className="text-base text-[var(--color-text-primary)] font-medium leading-relaxed">
                      {result.keterangan}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1 font-bold">Waktu Konfirmasi Blok</p>
                    <p className="text-base text-[var(--color-text-primary)] font-medium font-mono">
                      {formatDateTime(result.timestamp)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1 font-bold">Tipe Transaksi</p>
                    <span className={`badge-color inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase ${result.isIncome ? 'bg-[var(--color-income)]/10 text-[var(--color-income)]' : 'bg-[var(--color-expense)]/10 text-[var(--color-expense)]'}`}>
                      {result.isIncome ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex flex-col justify-center items-start md:items-end print:items-end p-6 rounded-2xl border print-light-border" style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-border-strong)' }}>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-bold">Total Nominal</p>
                  <p className={`nominal-amount text-4xl tabular-nums tracking-tight ${result.isIncome ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'}`} style={{ fontWeight: 'var(--fw-extrabold)' }}>
                    {idr(result.nominal)}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-4 font-mono max-w-[200px] text-left md:text-right print:text-right no-print">
                    Tercatat secara permanen tanpa kemungkinan diubah oleh pihak manapun.
                  </p>
                </div>

              </div>

              {/* Technical Metadata */}
              <div className="rounded-xl p-4 border space-y-3 font-mono text-[11px] print-light-border" style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'var(--color-border-strong)' }}>
                <div className="flex flex-col md:flex-row justify-between gap-1">
                  <span className="text-[var(--color-text-muted)]">Smart Contract:</span>
                  <span className="text-[var(--color-brand-orange)] break-all flex items-center gap-1">
                    0xBE4FF6a8A141d05827Fb7581B03e30fe01257f62
                    <a href={explorerUrl} target="_blank" rel="noreferrer" className="hover:text-white no-print" title="Lihat di Explorer">
                      <ExternalLink size={12} />
                    </a>
                  </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-1">
                  <span className="text-[var(--color-text-muted)]">Network / Chain:</span>
                  <span className="text-[var(--color-text-secondary)]">Polygon PoS (Amoy Testnet)</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between gap-1">
                  <span className="text-[var(--color-text-muted)]">Tx Proof Hash (Simulated):</span>
                  <span className="text-[var(--color-text-secondary)] break-all">{mockTxHash}</span>
                </div>
              </div>

            </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-center gap-4 no-print">
            <Button variant="outline" className="gap-2 px-6" onClick={handlePrint}>
              <Printer size={16} />
              Cetak / Download PDF
            </Button>
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
              style={{ background: '#8247E5' }} // Polygon Purple
            >
              <Fingerprint size={16} />
              Lihat di PolygonScan
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
