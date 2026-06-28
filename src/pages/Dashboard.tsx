import DashboardLayout from '../layouts/DashboardLayout'

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-text-primary mt-2">0</p>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Total Scans</p>
          <p className="text-3xl font-bold text-text-primary mt-2">0</p>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Open Ports</p>
          <p className="text-3xl font-bold text-text-primary mt-2">0</p>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Active Services</p>
          <p className="text-3xl font-bold text-text-primary mt-2">0</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard