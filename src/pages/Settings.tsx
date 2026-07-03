import DashboardLayout from '../layouts/DashboardLayout'

function Settings() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-text-primary font-semibold mb-4">Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  defaultValue="admin"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  defaultValue="admin@sentinelx.com"
                />
              </div>
              <button className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Save Profile
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-text-primary font-semibold mb-4">Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <button className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {/* Scan Settings */}
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-text-primary font-semibold mb-4">Scan Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">Scan Timeout (seconds)</label>
                <input
                  type="number"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  defaultValue="30"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm font-medium mb-1">Thread Count</label>
                <input
                  type="number"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary-purple transition-colors"
                  defaultValue="10"
                />
              </div>
              <button className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <h3 className="text-text-primary font-semibold mb-4">Theme</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="radio" name="theme" id="dark" defaultChecked />
                <label htmlFor="dark" className="text-text-primary">Dark Theme</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" name="theme" id="light" />
                <label htmlFor="light" className="text-text-primary">Light Theme</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="radio" name="theme" id="system" />
                <label htmlFor="system" className="text-text-primary">System Default</label>
              </div>
              <button className="bg-primary-purple text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Apply Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings