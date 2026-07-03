import DashboardLayout from '../layouts/DashboardLayout'

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155]">
          <p className="text-[#94A3B8] text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-white mt-2">47</p>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155]">
          <p className="text-[#94A3B8] text-sm">Total Scans</p>
          <p className="text-3xl font-bold text-white mt-2">128</p>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155]">
          <p className="text-[#94A3B8] text-sm">Open Ports</p>
          <p className="text-3xl font-bold text-white mt-2">312</p>
        </div>
        <div className="bg-[#1E293B] p-6 rounded-lg border border-[#334155]">
          <p className="text-[#94A3B8] text-sm">Active Services</p>
          <p className="text-3xl font-bold text-white mt-2">89</p>
        </div>
      </div>
      <div className="mt-6 bg-[#1E293B] p-6 rounded-lg border border-[#334155]">
        <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-[#334155]">
            <div>
              <p className="text-white">Scan completed for 192.168.1.0/24</p>
              <p className="text-[#94A3B8] text-sm">5 new assets discovered</p>
            </div>
            <span className="text-[#94A3B8] text-sm">2 min ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#334155]">
            <div>
              <p className="text-white">Asset 192.168.1.45 updated</p>
              <p className="text-[#94A3B8] text-sm">New service detected: HTTP</p>
            </div>
            <span className="text-[#94A3B8] text-sm">15 min ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-white">New report generated</p>
              <p className="text-[#94A3B8] text-sm">assets_2026-06-28.csv</p>
            </div>
            <span className="text-[#94A3B8] text-sm">1 hour ago</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard