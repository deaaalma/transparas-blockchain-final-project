import { Bell, UserCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWallet } from '../../features/blockchain/WalletContext';
import { Button } from '../ui/Button';

export function Topbar() {
  const { isConnected, connectWallet, reconnectWallet, isOwner } = useWallet();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Initial fetch
    fetch('/api/v1/profile')
      .then(res => res.json())
      .then(data => {
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
          src="/logo.png"
          alt=""
          className="w-6 h-6 rounded-lg object-cover shrink-0"
          aria-hidden="true"
        />
        <span className="text-sm text-[var(--color-text-primary)] uppercase" style={{ fontWeight: 'var(--fw-bold)', letterSpacing: '0.14em' }}>
          TransParas
        </span>
      </NavLink>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Connect / status */}
        {isConnected ? (
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
        ) : (
          <Button size="sm" variant="outline" onClick={connectWallet} className="gap-2 rounded-xl">
            <UserCircle2 size={14} aria-hidden="true" />
            Connect MetaMask
          </Button>
        )}

        <button
          aria-label="Notifikasi"
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--color-brand-orange)' }} aria-hidden="true" />
        </button>

        <NavLink
          to="/profil"
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors hover:ring-2 hover:ring-[var(--color-brand-orange)] overflow-hidden shrink-0"
          style={{ background: 'var(--color-bg-card-hover)', color: 'var(--color-text-secondary)' }}
          title="Profil Organisasi"
          aria-label="Profil Organisasi"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Profil" className="w-full h-full object-cover" />
          ) : (
            'B'
          )}
        </NavLink>
      </div>
    </header>
  );
}
