import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, ArrowRight, ShieldCheck, Lock, Activity, Eye, CheckCircle2, ChevronRight, PieChart, ClipboardList, Search } from 'lucide-react';

const LogoMark = () => (
  <div className="p-2 rounded-xl bg-[var(--color-brand-orange)]/10">
    <Hexagon size={24} className="text-[var(--color-brand-orange)]" />
  </div>
);

const SectionEyebrow = ({ label, tag }: { label: string; tag?: string }) => (
  <div className="flex items-center gap-3">
    <span className="flex items-center gap-2 text-sm font-medium text-white/70">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-orange)]" />
      {label}
    </span>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-[var(--color-brand-orange)]/30 text-[var(--color-brand-orange)] text-xs font-semibold">
        {tag}
      </span>
    )}
  </div>
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* Global Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video autoPlay loop muted playsInline
          className="w-full h-full object-cover pointer-events-none opacity-40 mix-blend-screen"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
        />
        <div className="absolute inset-0 bg-[#0c0c0c]/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/5 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/5 z-[5]" />

      {/* SVG Filters */}
      <svg className="hidden">
        <filter id="c3-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
        </filter>
      </svg>

      <div className="relative z-10">
        {/* Section 1 - Navbar */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-xl font-bold tracking-tight text-white">Trans<span className="text-[var(--color-brand-orange)]">Paras</span></span>
          </div>

          <div className="hidden md:flex gap-8">
            {['Beranda', 'Tentang Kami', 'Dokumentasi', 'Kontak'].map((link, i) => (
              <motion.a 
                key={link}
                href="#"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="text-white/70 text-sm font-medium hover:text-white transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </div>

          <div className="hidden md:block">
            <Link 
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-5 py-2.5 transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Masuk Pengelola
              <ChevronRight size={16} className="group-hover:translate-x-[2px] transition-transform" />
            </Link>
          </div>
        </motion.nav>

        {/* Section 2 - Hero */}
        <section className="pt-16 md:pt-28 pb-20 text-center flex flex-col items-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
          >
            <div className="text-white mb-2">Keuangan Desa.</div>
            <div 
              className="animate-shiny inline-block"
              style={{
                backgroundImage: 'linear-gradient(to right, #ff6a00 0%, #ff9a44 20%, #ffd494 40%, #ffffff 50%, #ffd494 60%, #ff9a44 80%, #ff6a00 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
                filter: 'url(#c3-noise)'
              }}
            >
              Transparan & Aman
            </div>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-white/60 max-w-lg text-base md:text-lg leading-[1.6]"
          >
            TransParas adalah platform cerdas berbasis Blockchain untuk mencatat, mengamankan, dan menampilkan aliran dana Desa Adat Bali agar dapat dipantau oleh seluruh krama desa secara real-time.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Link 
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-orange)] text-white font-medium text-sm px-8 py-3.5 transition-all hover:bg-[var(--color-brand-orange-hover)] active:scale-[0.98] shadow-lg shadow-[var(--color-brand-orange)]/20"
            >
              Coba Dasbor TransParas
              <ChevronRight size={16} className="group-hover:translate-x-[2px] transition-transform" />
            </Link>
            <span className="text-xs text-white/40">Didukung oleh Polygon Network</span>
          </motion.div>
        </section>

        {/* Section 3 - macOS/Browser strip */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10 mt-10"
        >
          <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/70">
            <div className="flex items-center gap-4">
              <Hexagon size={14} className="text-[var(--color-brand-orange)]" />
              <span className="font-bold text-white">TransParas</span>
              <span className="hidden sm:inline hover:text-white cursor-pointer">File</span>
              <span className="hidden sm:inline hover:text-white cursor-pointer">Edit</span>
              <span className="hidden md:inline hover:text-white cursor-pointer">View</span>
              <span className="hidden md:inline hover:text-white cursor-pointer">Laporan</span>
            </div>
            <div className="flex items-center gap-2">
              <Search size={14} />
              <span>Real-time Sync: Active</span>
            </div>
          </div>
        </motion.div>

        {/* Section 4 - Dashboard Mockup */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-6xl mx-auto px-6 py-16 md:py-24"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl">
            {/* Title bar */}
            <div className="h-10 bg-black/50 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 text-xs text-white/50 font-medium">
                TransParas — Dasbor Pengelola
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 md:h-[520px]">
              {/* Sidebar */}
              <div className="hidden md:flex md:col-span-3 border-r border-white/10 bg-black/30 p-4 flex-col gap-6">
                <button className="w-full rounded-lg bg-[var(--color-brand-orange)] text-white text-xs font-semibold px-3 py-2.5 flex items-center justify-center gap-2 hover:bg-[var(--color-brand-orange-hover)] transition-colors">
                  <ShieldCheck size={16} /> Verifikasi Blockchain
                </button>
                <nav className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-white text-sm font-medium">
                    <PieChart size={16} /> Analytics
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 text-sm font-medium">
                    <ClipboardList size={16} /> Transaksi
                  </div>
                </nav>
              </div>
              {/* Main Content Mockup */}
              <div className="col-span-1 md:col-span-9 p-8 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold text-white">Ikhtisar Keuangan</h2>
                  <div className="px-3 py-1.5 rounded-full bg-[#00e696]/10 text-[#00e696] text-xs font-medium border border-[#00e696]/20 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00e696] animate-pulse"></div>
                    Polygon Connected
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Saldo', value: 'Rp 145.500.000', color: 'text-white' },
                    { label: 'Pemasukan Bulan Ini', value: '+ Rp 24.000.000', color: 'text-[#00e696]' },
                    { label: 'Pengeluaran Bulan Ini', value: '- Rp 8.200.000', color: 'text-[#ff2e63]' },
                  ].map((stat, i) => (
                    <div key={i} className="liquid-glass rounded-xl p-5 border border-white/5">
                      <p className="text-xs text-white/50 font-medium mb-2">{stat.label}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border border-white/10 rounded-xl overflow-x-auto">
                  <div className="bg-white/5 px-4 py-3 border-b border-white/10 text-xs font-medium text-white/50 min-w-[500px] grid grid-cols-4">
                    <span>ID Transaksi</span>
                    <span>Tipe</span>
                    <span>Jumlah</span>
                    <span>Status</span>
                  </div>
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="px-4 py-4 border-b border-white/5 text-sm text-white/80 min-w-[500px] grid grid-cols-4 items-center">
                      <span className="font-mono text-xs text-white/40">0x8f...4e21</span>
                      <span>Iuran Krama</span>
                      <span className="text-[#00e696]">+ Rp 50.000</span>
                      <span className="flex items-center gap-1.5 text-xs text-white/60"><CheckCircle2 size={14} className="text-[#00e696]"/> Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 5 - Features Triage */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <SectionEyebrow label="Transparansi" tag="Blockchain-native" />
              <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
                Pantau Setiap Rupiah <br /> <span className="text-white/50">Tanpa Rahasia.</span>
              </h2>
              <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
                TransParas mencatat setiap pemasukan dan pengeluaran desa ke dalam buku besar digital yang tidak bisa dimanipulasi. Krama bisa fokus pada pembangunan, sistem kami yang menjaga kepercayaannya.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {['Real-time Sinkronisasi', 'Anti-Manipulasi', 'Akses Publik Terbuka', 'Polygon Network'].map(chip => (
                  <span key={chip} className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="liquid-glass rounded-2xl p-5 border border-white/10"
            >
              <div className="text-xs font-semibold text-white/50 mb-4 px-1">Aktivitas Terbaru · Tercatat Permanen</div>
              <div className="flex flex-col gap-3">
                {[
                  { title: "Sumbangan Pura Desa", desc: "Masuk: Rp 5.000.000", color: "#00e696" },
                  { title: "Pembelian Alat Upacara", desc: "Keluar: Rp 1.200.000", color: "#ff2e63" },
                  { title: "Iuran Wajib Bulanan", desc: "Masuk: Rp 150.000", color: "#00e696" },
                  { title: "Perbaikan Bale Banjar", desc: "Keluar: Rp 8.000.000", color: "#ff2e63" }
                ].map((item, i) => (
                  <div key={i} className="liquid-glass rounded-lg p-3.5 flex justify-between items-center border border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: item.color }}>{item.desc}</p>
                    </div>
                    <Lock size={14} className="text-white/30" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 6 - Testimonials */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
          <div className="text-center mb-16">
            <SectionEyebrow label="Kepercayaan Publik" />
            <h2 className="mt-4 text-3xl font-semibold">Mengembalikan Kepercayaan Warga</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "TransParas membuat manajemen keuangan desa kami jauh lebih mudah. Warga tidak lagi curiga karena semua bisa dicek langsung di HP mereka.",
                name: "Wayan Sudarma",
                role: "Bendahara Desa Adat",
                company: "DESA ADAT KUTA"
              },
              {
                quote: "Sistem blockchain memastikan bahwa setelah uang dicatat, tidak ada yang bisa mengubah angkanya. Ini revolusi bagi transparansi desa kami.",
                name: "Made Wirawan",
                role: "Kelian Adat",
                company: "DESA ADAT UBUD"
              },
              {
                quote: "Sebagai warga biasa, saya merasa tenang menyumbang ke kas desa karena laporan keuangannya kini seterbuka dan semodern ini.",
                name: "Nyoman Parta",
                role: "Krama Desa",
                company: "DESA ADAT SANUR"
              }
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="liquid-glass rounded-2xl p-8 border border-white/10 flex flex-col h-full"
              >
                <blockquote className="text-sm text-white/80 leading-[1.6] flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-white/10">
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/50 mt-0.5">{t.role}</div>
                  <div className="text-xs text-[var(--color-brand-orange)] font-bold tracking-widest mt-2 uppercase">{t.company}</div>
                </figcaption>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 7 - Final CTA */}
        <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="liquid-glass relative overflow-hidden rounded-[2.5rem] px-8 py-20 md:py-28 text-center border border-white/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_0%,rgba(255,106,0,0.15),transparent_70%)] opacity-80 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
                Buka lembaran baru. <br />
                <span className="text-[var(--color-brand-orange)]">Bangun transparansi.</span>
              </h2>
              <p className="mt-6 text-white/60 max-w-md mx-auto text-sm md:text-base leading-[1.6]">
                Bergabunglah dengan desa-desa adat lainnya yang telah beralih ke masa depan transparansi publik berbasis blockchain.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-8 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98]"
                >
                  Mulai Gunakan TransParas
                  <ChevronRight size={16} className="group-hover:translate-x-[2px] transition-transform" />
                </Link>
                <button className="rounded-full border border-white/15 text-white text-sm font-medium px-8 py-3.5 hover:bg-white/5 transition-colors flex items-center gap-2 cursor-not-allowed opacity-50">
                  <Eye size={16} /> Lihat Demo Publik
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
