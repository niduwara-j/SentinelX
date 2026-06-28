function App() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="bg-dark-card p-8 rounded-lg border border-dark-border max-w-md w-full">
        <h1 className="text-2xl font-bold text-text-primary text-center">SentinelX</h1>
        <p className="text-text-secondary text-center mt-2">Network Discovery Platform</p>
        <div className="mt-6 space-y-3">
          <button className="w-full bg-primary-purple text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
            Login
          </button>
          <button className="w-full bg-primary-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Register
          </button>
        </div>
        <p className="text-text-secondary text-center mt-4 text-sm">
          Tailwind v4 is working!
        </p>
      </div>
    </div>
  )
}

export default App