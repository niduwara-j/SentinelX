import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#94A3B8] text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-[#94A3B8] text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 bg-[#0F172A] border-[#334155] rounded" />
            <span className="ml-2 text-[#94A3B8] text-sm">Remember me</span>
          </label>
          <Link to="#" className="text-[#7C3AED] text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-[#7C3AED] text-white py-2 rounded-lg hover:bg-[#6D28D9] transition-colors font-medium"
        >
          Sign In
        </button>

        <p className="text-center text-[#94A3B8] text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2563EB] hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login