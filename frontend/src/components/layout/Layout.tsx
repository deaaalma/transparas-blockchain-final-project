import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddTransactionModal } from '../modals/AddTransactionModal';
import { useWallet } from '../../features/blockchain/WalletContext';

export function Layout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isOwner } = useWallet();

  return (
    <div className="flex h-full w-full overflow-hidden relative" style={{ background: 'var(--color-bg-base)' }}>
      {/* ── Narrow Sidebar (icon-only) ─────────────────────────────── */}
      <Sidebar />

      {/* ── Main area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <Topbar />

        {/* Scrollable content area where nested routes render */}
        <main className="flex-1 overflow-y-auto px-7 pt-6 pb-24 relative" style={{ background: 'var(--color-bg-base)' }}>
          <Outlet />
        </main>
      </div>

      {/* ── Global Floating Action Button ──────────────────────────── */}
      {isOwner && (
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange-hover)] shadow-lg border border-white/10 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 z-50 group"
          title="Tambah Transaksi"
        >
          <Plus size={28} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      {isAddModalOpen && (
        <AddTransactionModal 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}
    </div>
  );
}
