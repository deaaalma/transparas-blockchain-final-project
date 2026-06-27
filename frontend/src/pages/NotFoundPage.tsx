import { Link } from 'react-router-dom'
import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'

export default function NotFoundPage() {
  const isAdmin = !!localStorage.getItem('token')
  const targetUrl = isAdmin ? '/dashboard' : '/'
  const targetLabel = isAdmin ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'

  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch('/404-animation.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error('Failed to load Lottie animation:', err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-6" style={{ background: 'var(--color-bg-base)' }}>
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto text-center p-10 rounded-3xl border border-[var(--color-border)] shadow-xl" style={{ background: 'var(--color-bg-surface)' }}>
        <div className="w-56 h-56 flex items-center justify-center mb-4">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} className="w-full h-full" />
          ) : (
            <div className="animate-pulse w-32 h-32 rounded-full bg-[var(--color-border)]" />
          )}
        </div>
        <h1 className="text-3xl tracking-tight text-[var(--color-text-primary)] mb-3" style={{ fontWeight: 'var(--fw-extrabold)' }}>
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link 
          to={targetUrl}
          className="h-12 px-8 flex items-center justify-center rounded-xl font-bold transition-all text-white hover:brightness-110 active:scale-95 shadow-lg"
          style={{ background: 'var(--color-brand-orange)', boxShadow: '0 8px 20px -8px var(--color-brand-orange)' }}
        >
          {targetLabel}
        </Link>
      </div>
    </div>
  )
}
