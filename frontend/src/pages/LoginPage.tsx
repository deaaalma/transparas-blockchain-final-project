import { LoginForm } from '../features/auth/components/LoginForm'
import { Shield, Hexagon } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-brand-orange)]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-brand-orange)]/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Side: Branding / Info */}
        <div className="hidden md:flex flex-col justify-between p-12 relative bg-gradient-to-br from-[var(--color-bg-surface)] to-[var(--color-bg-base)] border-r border-[var(--color-border)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 rounded-xl bg-[var(--color-brand-orange)]/10">
                <Hexagon size={28} className="text-[var(--color-brand-orange)]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">Trans<span className="text-[var(--color-brand-orange)]">Paras</span></span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight text-[var(--color-text-primary)] mb-6">
              Transparansi <br />
              <span className="text-[var(--color-text-secondary)] font-light">Desa Adat Bali.</span>
            </h1>
            <p className="text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              Platform pelaporan keuangan berbasis teknologi blockchain yang aman, transparan, dan terpercaya untuk kesejahteraan Desa Adat.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-12 p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border)]">
            <div className="p-3 rounded-full bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)]">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">Keamanan Terjamin</p>
              <p className="text-xs text-[var(--color-text-muted)]">Didukung oleh Polygon Network</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 md:hidden flex items-center gap-3">
            <Hexagon size={24} className="text-[var(--color-brand-orange)]" />
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">Trans<span className="text-[var(--color-brand-orange)]">Paras</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Selamat Datang Kembali</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Masuk ke akun Anda untuk mengelola dasbor keuangan desa.</p>
          </div>

          <LoginForm />
        </div>

      </div>
    </div>
  )
}
