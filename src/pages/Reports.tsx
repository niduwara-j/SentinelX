import DashboardLayout from '../layouts/DashboardLayout'
import { Download, FileJson, FileSpreadsheet } from 'lucide-react'

function Reports() {
  const handleDownload = (format: string) => {
    console.log(`Downloading report as ${format}`)
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Reports</h2>
        
        {/* Download Buttons */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border mb-6">
          <h3 className="text-text-primary font-semibold mb-4">Generate Report</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleDownload('csv')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet size={18} />
              Download CSV
            </button>
            <button
              onClick={() => handleDownload('json')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileJson size={18} />
              Download JSON
            </button>
          </div>
        </div>

        {/* Previous Reports */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-text-primary font-semibold mb-4">Previous Reports</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-dark-border">
              <div>
                <p className="text-text-primary">assets_2026-06-28.csv</p>
                <p className="text-text-secondary text-sm">Generated 2 hours ago</p>
              </div>
              <button className="text-primary-purple hover:text-purple-400 transition-colors">
                <Download size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dark-border">
              <div>
                <p className="text-text-primary">scan_report_2026-06-27.json</p>
                <p className="text-text-secondary text-sm">Generated 1 day ago</p>
              </div>
              <button className="text-primary-purple hover:text-purple-400 transition-colors">
                <Download size={18} />
              </button>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-text-primary">network_assets_2026-06-26.csv</p>
                <p className="text-text-secondary text-sm">Generated 2 days ago</p>
              </div>
              <button className="text-primary-purple hover:text-purple-400 transition-colors">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Reports