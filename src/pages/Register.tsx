import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Register attempt:', { username, email, password })
  }

  return (
    <AuthLayout title="Create Account" subtitle="Get started with SentinelX">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-text-secondary text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
            placeholder="johndoe"
            required
          />
        </div>

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

        <div>
          <label className="block text-text-secondary text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary-blue text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Account
        </button>

        <p className="text-center text-text-secondary text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-purple hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register