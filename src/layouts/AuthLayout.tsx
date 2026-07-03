import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="bg-[#1E293B] p-8 rounded-lg border border-[#334155] max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">SentinelX</h1>
          <h2 className="text-xl font-semibold text-white mt-4">{title}</h2>
          <p className="text-[#94A3B8] mt-1">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout