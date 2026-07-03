import { useState } from 'react'

function ScanForm() {
  const [target, setTarget] = useState('')
  const [scanType, setScanType] = useState('quick')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Starting scan:', { target, scanType })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-1">
          Target IP / Range
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
          placeholder="192.168.1.1 or 192.168.1.0/24"
          required
        />
      </div>

      <div>
        <label className="block text-text-secondary text-sm font-medium mb-1">
          Scan Type
        </label>
        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
        >
          <option value="quick">Quick Scan (Common Ports)</option>
          <option value="full">Full Scan (1-65535)</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-primary-purple text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        Start Scan
      </button>
    </form>
  )
}

export default ScanForm