import { useEffect, useState } from "react";
import { Server, Radar, Network, Activity } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RecentScans from "@/components/dashboard/RecentScans";
import RecentAssets from "@/components/dashboard/RecentAssets";
import PortsChart from "@/components/dashboard/PortsChart";
import ServicesChart from "@/components/dashboard/ServicesChart";
import Spinner from "@/components/common/Spinner";
import { useAssets } from "@/hooks/useAssets";
import { useScanner } from "@/hooks/useScanner";
import { assetService } from "@/services/assetService";

// V1 has no dedicated aggregation endpoint, so the port/service distribution
// charts are built client-side from each asset's service list. Capped to
// keep this cheap; a real aggregate endpoint (e.g. GET /assets/stats) is a
// good Version 2 backend addition once asset counts grow.
const CHART_ASSET_SAMPLE_LIMIT = 50;

export default function Dashboard() {
  const { assets, isLoading: assetsLoading } = useAssets();
  const { scans } = useScanner();
  const [portCounts, setPortCounts] = useState<Record<number, number>>({});
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({});
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    if (assetsLoading) return;

    let cancelled = false;

    async function loadChartData() {
      setChartsLoading(true);
      const sample = assets.slice(0, CHART_ASSET_SAMPLE_LIMIT);
      const details = await Promise.all(
        sample.map((a) => assetService.getAsset(a.id).catch(() => null))
      );

      const ports: Record<number, number> = {};
      const services: Record<string, number> = {};

      for (const detail of details) {
        if (!detail) continue;
        for (const service of detail.services) {
          ports[service.port] = (ports[service.port] || 0) + 1;
          const name = service.service_name || "unknown";
          services[name] = (services[name] || 0) + 1;
        }
      }

      if (!cancelled) {
        setPortCounts(ports);
        setServiceCounts(services);
        setChartsLoading(false);
      }
    }

    loadChartData();
    return () => {
      cancelled = true;
    };
  }, [assets, assetsLoading]);

  const activeScans = scans.filter((s) => s.status === "running" || s.status === "pending").length;

  if (assetsLoading) {
    return <Spinner label="Loading dashboard..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Overview of your network's current state.</p>
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assets" value={assets.length} icon={<Server className="h-5 w-5" />} tone="primary" />
        <StatCard label="Total Scans" value={scans.length} icon={<Radar className="h-5 w-5" />} tone="secondary" />
        <StatCard
          label="Assets Online"
          value={assets.filter((a) => a.status === "up").length}
          icon={<Network className="h-5 w-5" />}
          tone="success"
        />
        <StatCard label="Active Scans" value={activeScans} icon={<Activity className="h-5 w-5" />} tone="warning" />
      </div>

      {assets.length === 0 && scans.length === 0 && (
        <div className="rounded-xl border border-border bg-card/60 p-5 text-center">
          <p className="text-sm text-text-secondary">
            No scan data available. Run your first network scan to populate the dashboard.
          </p>
        </div>
      )}


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {chartsLoading ? (
          <>
            <div className="rounded-xl border border-border bg-card p-5"><Spinner label="Loading chart..." /></div>
            <div className="rounded-xl border border-border bg-card p-5"><Spinner label="Loading chart..." /></div>
          </>
        ) : (
          <>
            <PortsChart portCounts={portCounts} />
            <ServicesChart serviceCounts={serviceCounts} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentScans scans={scans} />
        <RecentAssets assets={assets} />
      </div>
    </div>
  );
}
