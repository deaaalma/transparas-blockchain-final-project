import { LoginForm } from '../features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 shadow-lg rounded bg-white w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}
