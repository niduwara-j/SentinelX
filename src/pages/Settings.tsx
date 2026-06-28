import DashboardLayout from '../layouts/DashboardLayout'

function Settings() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Settings</h2>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary">Settings UI will go here</p>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings