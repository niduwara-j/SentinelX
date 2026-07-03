import DashboardLayout from '../layouts/DashboardLayout'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  // Port Distribution Data (Doughnut Chart)
  const portData = {
    labels: ['22 (SSH)', '80 (HTTP)', '443 (HTTPS)', '21 (FTP)', 'Other'],
    datasets: [
      {
        data: [35, 25, 20, 10, 10],
        backgroundColor: ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#6B7280'],
        borderColor: ['#1E293B'],
        borderWidth: 2,
      },
    ],
  }

  // Services Data (Bar Chart)
  const servicesData = {
    labels: ['HTTP', 'SSH', 'HTTPS', 'FTP', 'DNS', 'SMTP'],
    datasets: [
      {
        label: 'Active Services',
        data: [45, 30, 25, 15, 12, 8],
        backgroundColor: ['#7C3AED', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94A3B8',
        },
      },
    },
  }

  return (
    <DashboardLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Total Assets</p>
          <p className="text-3xl font-bold text-text-primary mt-2">47</p>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Total Scans</p>
          <p className="text-3xl font-bold text-text-primary mt-2">128</p>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Open Ports</p>
          <p className="text-3xl font-bold text-text-primary mt-2">312</p>
        </div>
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <p className="text-text-secondary text-sm">Active Services</p>
          <p className="text-3xl font-bold text-text-primary mt-2">89</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-text-primary font-semibold mb-4">Port Distribution</h3>
          <div className="h-64">
            <Doughnut data={portData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-text-primary font-semibold mb-4">Most Common Services</h3>
          <div className="h-64">
            <Bar data={servicesData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-dark-card p-6 rounded-lg border border-dark-border">
        <h3 className="text-text-primary font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-dark-border">
            <div>
              <p className="text-text-primary">Scan completed for 192.168.1.0/24</p>
              <p className="text-text-secondary text-sm">5 new assets discovered</p>
            </div>
            <span className="text-text-secondary text-sm">2 min ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-dark-border">
            <div>
              <p className="text-text-primary">Asset 192.168.1.45 updated</p>
              <p className="text-text-secondary text-sm">New service detected: HTTP</p>
            </div>
            <span className="text-text-secondary text-sm">15 min ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-text-primary">New report generated</p>
              <p className="text-text-secondary text-sm">assets_2026-06-28.csv</p>
            </div>
            <span className="text-text-secondary text-sm">1 hour ago</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard