import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { Radar } from "lucide-react";
import type { Scan } from "@/types/scan";
import { formatDate } from "@/utils/formatDate";
import { SCAN_STATUS_LABEL } from "@/utils/constants";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger"> = {
  pending: "neutral",
  running: "warning",
  completed: "success",
  failed: "danger",
};

export default function RecentScans({ scans }: { scans: Scan[] }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Recent Scans</h3>
        <Link to="/scan" className="text-xs font-medium text-primary hover:underline">
          New scan
        </Link>
      </div>

      {scans.length === 0 ? (
        <EmptyState
          icon={<Radar className="h-5 w-5" />}
          title="No scans yet"
          description="Run your first network scan to start populating the asset inventory."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {scans.slice(0, 5).map((scan) => (
            <div key={scan.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-mono text-sm text-text-primary">{scan.target}</p>
                <p className="text-xs text-text-secondary">{formatDate(scan.started_at)}</p>
              </div>
              <Badge tone={statusTone[scan.status]}>{SCAN_STATUS_LABEL[scan.status]}</Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
