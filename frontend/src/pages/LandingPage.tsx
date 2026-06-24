import { Link } from 'react-router-dom';
import { Hexagon, ArrowRight, Activity, ShieldCheck, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[var(--color-bg-base)] overflow-y-auto custom-scrollbar text-[var(--color-text-primary)]">
      {/* Top Navbar Public */}
      <nav className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--color-brand-orange)]/10">
            <Hexagon size={28} className="text-[var(--color-brand-orange)]" />
          </div>
          <span className="text-xl font-bold tracking-tight">Trans<span className="text-[var(--color-brand-orange)]">Paras</span></span>
        </div>
        <Link 
          to="/login" 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-bg-surface)] hover:bg-[var(--color-brand-orange)] hover:text-white border border-[var(--color-border)] transition-all duration-300 text-sm font-medium"
        >
          Masuk sebagai Pengelola
          <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] text-sm font-medium mb-6">
            <ShieldCheck size={16} />
            Transparansi Desa Adat Bali Berbasis Blockchain
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Kepercayaan Tumbuh dari <span className="text-[var(--color-brand-orange)]">Keterbukaan</span>
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Portal publik bagi krama desa untuk memantau aliran dana dan laporan keuangan Desa Adat secara real-time, transparan, dan tidak dapat dimanipulasi.
          </p>
        </div>

        {/* Public Stats/Info (Mockup - In Real life would fetch from public API) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-150">
          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-brand-orange)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-brand-orange)]/20 transition-all"></div>
            <Activity className="text-[var(--color-brand-orange)] mb-4" size={32} />
            <h3 className="text-3xl font-bold mb-2">Real-time</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Semua transaksi tercatat dan dapat diverifikasi langsung di jaringan Polygon.</p>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-brand-orange)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-brand-orange)]/20 transition-all"></div>
            <Search className="text-[var(--color-brand-orange)] mb-4" size={32} />
            <h3 className="text-3xl font-bold mb-2">Transparan</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Krama desa dapat memantau setiap rupiah yang masuk dan keluar tanpa ada yang disembunyikan.</p>
          </div>

          <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-brand-orange)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-brand-orange)]/20 transition-all"></div>
            <ShieldCheck className="text-[var(--color-brand-orange)] mb-4" size={32} />
            <h3 className="text-3xl font-bold mb-2">Aman</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Data diamankan menggunakan kriptografi mutakhir, tidak bisa diubah secara sepihak.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
