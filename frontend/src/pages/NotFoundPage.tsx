import { Link } from 'react-router-dom'
import lottie from 'lottie-web'
import { useEffect, useRef } from 'react'

export default function NotFoundPage() {
  const isAdmin = !!localStorage.getItem('token')
  const targetUrl = isAdmin ? '/dashboard' : '/'
  const targetLabel = isAdmin ? 'BACK TO DASHBOARD' : 'BACK TO HOME'

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: any = null;
    if (containerRef.current) {
      try {
        instance = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/404-animation.json'
        });
      } catch (err) {
        console.error('Failed to load Lottie animation:', err);
      }
    }
    return () => {
      if (instance) instance.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-6" style={{ background: 'var(--color-bg-base)' }}>
      <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-2xl mb-8" ref={containerRef}>
        </div>
        
        <h1 
          className="text-sm md:text-base tracking-[0.2em] md:tracking-[0.3em] font-bold mb-10" 
          style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}
        >
          Opps! Page Not Found
        </h1>
        
        <Link 
          to={targetUrl}
          className="h-12 px-10 flex items-center justify-center rounded-full text-sm font-bold transition-all text-white hover:brightness-110 active:scale-95"
          style={{ background: 'var(--color-brand-orange)' }}
        >
          {targetLabel}
        </Link>
      </div>
    </div>
  )
}
