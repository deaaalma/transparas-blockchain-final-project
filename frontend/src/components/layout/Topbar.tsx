import { Bell, UserCircle2, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '../../features/blockchain/WalletContext';
import { Button } from '../ui/Button';
import { api } from '../../lib/axios';
import logoImg from '../../assets/logo.png';

export function Topbar() {
  const { isConnected, connectWallet, reconnectWallet, disconnectWallet, isOwner } = useWallet();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const isAdmin = !!localStorage.getItem('token');

  useEffect(() => {
    // Handle click outside to close notif
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  useEffect(() => {
    // Initial fetch
    api.get('/profile')
      .then(res => {
        const data = res.data;
        if (data && data.logoUrl) setLogoUrl(data.logoUrl);
      })
      .catch(console.error);


    // Listen for updates from ProfilePage
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setLogoUrl(customEvent.detail);
    };
    
    window.addEventListener('profileUpdated', handleUpdate);
    return () => window.removeEventListener('profileUpdated', handleUpdate);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-7 shrink-0 border-b border-[var(--color-border)]"
      style={{ height: 60, background: 'var(--color-bg-surface)' }}
    >
      {/* Logo text */}
      <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Ke Dashboard Utama">
        <img
          src={logoImg}
          alt=""
          className="w-6 h-6 rounded-lg object-cover shrink-0"
          aria-hidden="true"
        />
        <span className="text-[13px] text-[var(--color-text-primary)]" style={{ fontWeight: 800, letterSpacing: '0.14em' }}>
          TRANSPARAS
        </span>
      </NavLink>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Status Admin vs Warga */}
        {!localStorage.getItem('token') ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold" style={{ background: 'var(--color-bg-card-hover)', borderColor: 'var(--color-border-strong)', color: 'var(--color-text-secondary)' }}>
            <UserCircle2 size={14} />
            Warga / Publik
          </div>
        ) : isConnected ? (
          <div className="flex items-center gap-1">
            <button
              onClick={reconnectWallet}
              title="Klik untuk ganti akun (Reconnect)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors hover:brightness-110 cursor-pointer"
              style={{
                background: 'var(--color-brand-orange-dim)',
                borderColor: 'rgba(249,115,22,0.3)',
                color: 'var(--color-brand-orange)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: 'var(--color-brand-orange)' }}
                aria-hidden="true"
              />
              {isOwner ? 'Bendahara Aktif' : 'Dompet Terhubung'}
            </button>
            <button
              onClick={disconnectWallet}
              title="Disconnect Wallet"
              className="flex items-center justify-center w-8 h-8 rounded-xl border transition-colors hover:bg-[var(--color-bg-card-hover)] cursor-pointer"
              style={{ borderColor: 'var(--color-border-strong)', color: 'var(--color-expense)' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={connectWallet} className="gap-2 rounded-xl">
            <UserCircle2 size={14} aria-hidden="true" />
            Connect MetaMask
          </Button>
        )}

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifikasi"
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isNotifOpen ? 'bg-[var(--color-bg-card-hover)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-secondary)]'}`}
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--color-brand-orange)' }} aria-hidden="true" />
          </button>

          {/* Dropdown Notifikasi */}
          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--color-bg-surface)] border border-[var(--color-border-strong)] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
              <div className="px-5 py-4 border-b border-[var(--color-border-strong)] flex items-center justify-between bg-[var(--color-bg-card)]">
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">Notifikasi</h3>
                <span className="text-[10px] font-bold text-[var(--color-brand-orange)] bg-[var(--color-brand-orange-dim)] px-2 py-0.5 rounded-full">2 Baru</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                
                {/* Item 1 */}
                <div className="px-5 py-4 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-input)] transition-colors cursor-pointer relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)]" />
                  <div className="pl-2">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Peringatan Saldo Rendah</p>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Kas operasional banjar bulan ini hampir mencapai batas minimum. Harap evaluasi pengeluaran.</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-medium">10 Menit yang lalu</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="px-5 py-4 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-input)] transition-colors cursor-pointer relative">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)]" />
                  <div className="pl-2">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Transaksi Baru Berhasil</p>
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Dana Punia sebesar Rp 1.500.000 berhasil disahkan dan dicatat ke dalam Polygon Blockchain.</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-medium">2 Jam yang lalu</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="px-5 py-4 hover:bg-[var(--color-bg-input)] transition-colors cursor-pointer pl-7 opacity-70">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Sistem Siap</p>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">Pembaruan keamanan sistem blockchain berhasil diterapkan. Tidak ada aksi yang diperlukan.</p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-2 font-medium">Kemarin, 14:30</p>
                </div>

              </div>
              <div className="p-3 border-t border-[var(--color-border-strong)] bg-[var(--color-bg-card)]">
                <button 
                  onClick={() => setIsNotifOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Tandai Semua Dibaca
                </button>
              </div>
            </div>
          )}
        </div>

        {isAdmin && (
          <NavLink
            to="/dashboard/profil"
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors hover:ring-2 hover:ring-[var(--color-brand-orange)] overflow-hidden shrink-0"
            style={{ background: 'var(--color-bg-card-hover)', color: 'var(--color-text-secondary)' }}
            title="Profil Organisasi"
            aria-label="Profil Organisasi"
          >
            {logoUrl ? (
              <img src={logoUrl === '/logo.png' ? logoImg : logoUrl} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              'B'
            )}
          </NavLink>
        )}
      </div>
    </header>
  );
}
