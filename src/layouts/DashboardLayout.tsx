import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Scan, 
  Package, 
  FileText, 
  Settings,
  LogOut 
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-[#334155] flex flex-col">
        <div className="p-6 border-b border-[#334155]">
          <h1 className="text-2xl font-bold text-white">SentinelX</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/scan" className="flex items-center gap-3 px-4 py-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors">
            <Scan size={20} />
            Network Scan
          </Link>
          <Link to="/assets" className="flex items-center gap-3 px-4 py-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors">
            <Package size={20} />
            Assets
          </Link>
          <Link to="/reports" className="flex items-center gap-3 px-4 py-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors">
            <FileText size={20} />
            Reports
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-[#94A3B8] hover:bg-[#1E293B] hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-[#334155]">
          <button className="flex items-center gap-3 px-4 py-2 text-[#94A3B8] hover:text-red-500 rounded-lg transition-colors w-full">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-[#111827] border-b border-[#334155] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-[#94A3B8] text-sm">Welcome, User</span>
            <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout