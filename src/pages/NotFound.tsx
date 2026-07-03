import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-dark-card p-8 rounded-lg border border-dark-border max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-primary-purple mb-4">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Page Not Found</h2>
        <p className="text-text-secondary mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="bg-primary-purple text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound