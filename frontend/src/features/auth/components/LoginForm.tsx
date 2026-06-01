import { useForm } from '../../../hooks/useForm'
import { authApi } from '../api/authApi'

export function LoginForm() {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    (vals) => {
      const errs: Record<string, string> = {}
      if (!String(vals.email).includes('@')) errs.email = 'Email tidak valid'
      if (String(vals.password).length < 8) errs.password = 'Min 8 karakter'
      return errs
    },
    async (vals) => {
      try {
        const res = await authApi.login({ email: String(vals.email), password: String(vals.password) })
        localStorage.setItem('token', res.token)
        // Redirect or update state here
      } catch (err) {
        console.error('Login failed', err)
      }
    }
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <input
          name="email"
          value={String(values.email)}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          placeholder="Email"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={String(values.password)}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          placeholder="Password"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Loading...' : 'Login'}
      </button>
    </form>
  )
}
