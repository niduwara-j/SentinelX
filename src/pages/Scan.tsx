import DashboardLayout from '../layouts/DashboardLayout'
import ScanForm from '../components/scanner/ScanForm'

function Scan() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Network Scan</h2>
        
        {/* Scan Form */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border mb-6">
          <h3 className="text-text-primary font-semibold mb-4">Start New Scan</h3>
          <ScanForm />
        </div>

        {/* Scan Results */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-text-primary font-semibold mb-4">Recent Scans</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Target</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Type</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Status</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Ports Found</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark-border">
                  <td className="py-3 text-text-primary">192.168.1.0/24</td>
                  <td className="py-3 text-text-secondary">Quick</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">Completed</span>
                  </td>
                  <td className="py-3 text-text-secondary">23</td>
                  <td className="py-3 text-text-secondary">2026-06-28 14:30</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-3 text-text-primary">192.168.1.1</td>
                  <td className="py-3 text-text-secondary">Full</td>
                  <td className="py-3">
                    <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs">In Progress</span>
                  </td>
                  <td className="py-3 text-text-secondary">-</td>
                  <td className="py-3 text-text-secondary">2026-06-28 14:45</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-primary">192.168.1.5</td>
                  <td className="py-3 text-text-secondary">Quick</td>
                  <td className="py-3">
                    <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded text-xs">Failed</span>
                  </td>
                  <td className="py-3 text-text-secondary">-</td>
                  <td className="py-3 text-text-secondary">2026-06-28 13:15</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Scan