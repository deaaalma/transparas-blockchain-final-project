import { useNavigate } from 'react-router-dom'
import { useForm } from '../../../hooks/useForm'
import { authApi } from '../api/authApi'
import { useAuth } from '../store/authContext'
import { Mail, Lock, Loader2 } from 'lucide-react'

export function LoginForm() {
  const navigate = useNavigate()
  const { dispatch } = useAuth()
  
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    (vals) => {
      const errs: Record<string, string> = {}
      if (!String(vals.email).includes('@')) errs.email = 'Format email tidak valid'
      if (String(vals.password).length < 6) errs.password = 'Kata sandi minimal 6 karakter'
      return errs
    },
    async (vals) => {
      try {
        const res = await authApi.login({ email: String(vals.email), password: String(vals.password) })
        localStorage.setItem('token', res.token)
        dispatch({ type: 'SET_USER', payload: res.user })
        navigate('/admin')
      } catch (err) {
        console.error('Login failed', err)
        alert('Gagal masuk. Periksa kembali email dan kata sandi Anda.')
      }
    }
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-secondary)] ml-1">Email</label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            <Mail size={18} />
          </div>
          <input
            name="email"
            value={String(values.email)}
            onChange={handleChange}
            className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors placeholder-[var(--color-text-muted)] ${errors.email ? 'border-[var(--color-expense)]' : 'border-[var(--color-border-strong)]'}`}
            placeholder="admin@desa.id"
          />
        </div>
        {errors.email && <p className="text-[var(--color-expense)] text-xs ml-1 animate-in slide-in-from-top-1">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-end ml-1">
          <label className="text-sm font-medium text-[var(--color-text-secondary)]">Kata Sandi</label>
          <a href="#" className="text-xs text-[var(--color-brand-orange)] hover:underline">Lupa sandi?</a>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
            <Lock size={18} />
          </div>
          <input
            name="password"
            type="password"
            value={String(values.password)}
            onChange={handleChange}
            className={`w-full h-12 pl-11 pr-4 rounded-xl border bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand-orange)] transition-colors placeholder-[var(--color-text-muted)] ${errors.password ? 'border-[var(--color-expense)]' : 'border-[var(--color-border-strong)]'}`}
            placeholder="••••••••"
          />
        </div>
        {errors.password && <p className="text-[var(--color-expense)] text-xs ml-1 animate-in slide-in-from-top-1">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full h-12 flex items-center justify-center gap-2 bg-[var(--color-brand-orange)] hover:bg-[#d96b1c] text-white font-bold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-brand-orange)]/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          'Masuk ke Dasbor'
        )}
      </button>
    </form>
  )
}
