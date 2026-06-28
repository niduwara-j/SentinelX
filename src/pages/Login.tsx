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
          <label className="block text-text-secondary text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-text-secondary text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input type="checkbox" className="w-4 h-4 bg-dark-bg border-dark-border rounded" />
            <span className="ml-2 text-text-secondary text-sm">Remember me</span>
          </label>
          <Link to="#" className="text-primary-purple text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-purple text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Sign In
        </button>

        <p className="text-center text-text-secondary text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-blue hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login