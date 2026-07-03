import DashboardLayout from '../layouts/DashboardLayout'
import { Search } from 'lucide-react'

function Assets() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Asset Inventory</h2>
        
        {/* Search and Filter */}
        <div className="bg-dark-card p-4 rounded-lg border border-dark-border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search assets..."
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
              />
            </div>
            <select className="bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Assets Table */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-text-secondary text-sm font-medium py-2">IP Address</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Hostname</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">OS</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Status</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Ports</th>
                  <th className="text-left text-text-secondary text-sm font-medium py-2">Services</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dark-border">
                  <td className="py-3 text-text-primary">192.168.1.1</td>
                  <td className="py-3 text-text-secondary">router.local</td>
                  <td className="py-3 text-text-secondary">Linux</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="py-3 text-text-secondary">5</td>
                  <td className="py-3 text-text-secondary">HTTP, SSH</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-3 text-text-primary">192.168.1.10</td>
                  <td className="py-3 text-text-secondary">webserver.local</td>
                  <td className="py-3 text-text-secondary">Ubuntu</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="py-3 text-text-secondary">3</td>
                  <td className="py-3 text-text-secondary">HTTP, HTTPS</td>
                </tr>
                <tr className="border-b border-dark-border">
                  <td className="py-3 text-text-primary">192.168.1.15</td>
                  <td className="py-3 text-text-secondary">db.local</td>
                  <td className="py-3 text-text-secondary">Windows</td>
                  <td className="py-3">
                    <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs">Inactive</span>
                  </td>
                  <td className="py-3 text-text-secondary">2</td>
                  <td className="py-3 text-text-secondary">MSSQL</td>
                </tr>
                <tr>
                  <td className="py-3 text-text-primary">192.168.1.20</td>
                  <td className="py-3 text-text-secondary">-</td>
                  <td className="py-3 text-text-secondary">Unknown</td>
                  <td className="py-3">
                    <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">Active</span>
                  </td>
                  <td className="py-3 text-text-secondary">8</td>
                  <td className="py-3 text-text-secondary">FTP, SMTP, DNS</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Assets