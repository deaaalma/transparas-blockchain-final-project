import { LoginForm } from '../features/auth/components/LoginForm'
import { Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#0c0c0c] text-white">
      {/* Global Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline
          className="w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
        />
        <div className="absolute inset-0 bg-[#0c0c0c]/60 backdrop-blur-[2px]"></div>
      </div>

      {/* SVG Filters */}
      <svg className="hidden">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 liquid-glass rounded-[2.5rem] overflow-hidden z-10 border border-white/10"
      >
        
        {/* Left Side: Branding / Info */}
        <div className="hidden md:flex flex-col justify-between p-12 relative bg-black/40 border-r border-white/5">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="TransParas Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-[var(--color-brand-orange)]/10" />
              <span className="text-2xl font-bold tracking-tight text-white">Trans<span className="text-[var(--color-brand-orange)]">Paras</span></span>
            </Link>
            
            <h1 className="text-4xl font-bold leading-tight text-white mb-6">
              Transparansi <br />
              <span className="text-white/50 font-light">Desa Adat Bali.</span>
            </h1>
            <p className="text-white/60 leading-relaxed max-w-sm text-sm">
              Platform pelaporan keuangan berbasis teknologi blockchain yang aman, transparan, dan terpercaya untuk kesejahteraan Desa Adat.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 mt-12 p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="p-3 rounded-full bg-[var(--color-brand-orange)]/20 text-[var(--color-brand-orange)]">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Keamanan Terjamin</p>
              <p className="text-xs text-white/50">Didukung oleh Polygon Network</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#0e1014]/60 backdrop-blur-md">
          <div className="mb-8 md:hidden flex items-center gap-3">
            <Link to="/">
              <img src="/logo.png" alt="TransParas Logo" className="w-8 h-8 rounded-lg object-cover inline-block" />
              <span className="text-xl font-bold tracking-tight text-white ml-2">Trans<span className="text-[var(--color-brand-orange)]">Paras</span></span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h2>
            <p className="text-sm text-white/60">Masuk ke akun Anda untuk mengelola dasbor keuangan desa.</p>
          </div>

          <LoginForm />
        </div>

      </motion.div>
    </div>
  )
}
