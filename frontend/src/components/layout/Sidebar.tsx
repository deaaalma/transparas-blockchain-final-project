import {
  LayoutDashboard, ClipboardList, TrendingUp, Shield, Settings, LogOut, Plus
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

function NavItem({
  icon, label, to, badge,
}: {
  icon: React.ReactNode; label: string; to: string; badge?: number;
}) {
  return (
    <NavLink
      to={to}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        [
          'relative flex items-center justify-start w-11 group-hover:w-full h-11 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden px-3 shrink-0',
          isActive
            ? 'bg-[var(--color-brand-orange-dim)] text-[var(--color-brand-orange)]'
            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-secondary)]',
        ].join(' ')
      }
    >
      <div className="shrink-0 flex items-center justify-center w-5 h-5">{icon}</div>
      <span className="ml-3 whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </span>
      {badge != null && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--color-brand-orange)]" aria-hidden="true" />
      )}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside
      className="group flex flex-col py-4 shrink-0 border-r border-[var(--color-border)] transition-[width] duration-300 ease-in-out w-16 hover:w-60 z-50 overflow-hidden px-2.5"
      style={{ background: 'var(--color-bg-surface)' }}
      aria-label="Navigasi utama"
    >
      {/* Logo */}
      <NavLink 
        to="/"
        className="flex items-center justify-start mb-6 w-full h-10 px-1 overflow-hidden shrink-0 cursor-pointer rounded-xl transition-colors hover:bg-[var(--color-bg-card-hover)]"
        title="Dashboard Utama"
      >
        <img
          src="/logo.png"
          alt="TransParas Logo"
          className="w-9 h-9 rounded-xl shrink-0 object-cover"
        />
        <span className="ml-3 text-sm uppercase tracking-widest font-bold text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          TransParas
        </span>
      </NavLink>

      <nav className="flex flex-col gap-1 w-full" aria-label="Menu">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" />
        <NavItem icon={<ClipboardList size={20} />} label="Transaksi" to="/transaksi" />
        <NavItem icon={<Shield size={20} />} label="Verifikasi" badge={1} to="/verifikasi" />
      </nav>

      <div className="flex flex-col gap-1 mt-auto w-full">
        <NavItem icon={<Settings size={20} />} label="Pengaturan" to="/pengaturan" />
        <button
          className="relative flex items-center justify-start w-11 group-hover:w-full h-11 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden px-3 shrink-0 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-hover)] hover:text-[var(--color-text-secondary)]"
          title="Keluar"
        >
          <div className="shrink-0 flex items-center justify-center w-5 h-5"><LogOut size={20} /></div>
          <span className="ml-3 whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}
