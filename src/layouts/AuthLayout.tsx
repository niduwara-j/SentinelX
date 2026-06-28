import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-dark-card p-8 rounded-lg border border-dark-border max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">SentinelX</h1>
          <h2 className="text-xl font-semibold text-text-primary mt-4">{title}</h2>
          <p className="text-text-secondary mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout