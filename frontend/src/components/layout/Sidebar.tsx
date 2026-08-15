import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Radar, Server, FileText, Settings,
  ShieldAlert, Activity, Bell, FolderSearch, Radio, Users, ShieldCheck,
} from "lucide-react";

interface NavItem {
  label: string;
  to?: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

// Active pages first, then placeholders reserved for later versions
// (per the roadmap: Vulnerabilities/Events/Alerts/Incidents/Threat Intel/Admin)
// left visible-but-disabled so the nav structure never has to be rebuilt.
const items: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
  { label: "Network Scan", to: "/scan", icon: <Radar className="h-4.5 w-4.5" /> },
  { label: "Assets", to: "/assets", icon: <Server className="h-4.5 w-4.5" /> },
  { label: "Reports", to: "/reports", icon: <FileText className="h-4.5 w-4.5" /> },
  { label: "Settings", to: "/settings", icon: <Settings className="h-4.5 w-4.5" /> },
];

const upcoming: NavItem[] = [
  { label: "Vulnerabilities", icon: <ShieldAlert className="h-4.5 w-4.5" />, disabled: true },
  { label: "Events", icon: <Activity className="h-4.5 w-4.5" />, disabled: true },
  { label: "Alerts", icon: <Bell className="h-4.5 w-4.5" />, disabled: true },
  { label: "Incidents", icon: <FolderSearch className="h-4.5 w-4.5" />, disabled: true },
  { label: "Threat Intel", icon: <Radio className="h-4.5 w-4.5" />, disabled: true },
  { label: "Administration", icon: <Users className="h-4.5 w-4.5" />, disabled: true },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <span className="text-base font-semibold tracking-tight text-text-primary">SentinelX</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to!}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-text-secondary hover:bg-primary/10 hover:text-text-primary"
              }`
            }
          >

            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <div className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-wider text-text-secondary/60">
          Coming in later versions
        </div>
        {upcoming.map((item) => (
          <div
            key={item.label}
            className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary/40"
            title="Planned for a future SentinelX version"
          >
            {item.icon}
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
