import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import type { ScanDetail } from "@/types/scan";
import { SCAN_STATUS_LABEL } from "@/utils/constants";

const statusTone: Record<string, "neutral" | "success" | "warning" | "danger"> = {
  pending: "neutral",
  running: "warning",
  completed: "success",
  failed: "danger",
};

export default function ScanProgress({ scan }: { scan: ScanDetail }) {
  const isActive = scan.status === "pending" || scan.status === "running";

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm text-text-primary">{scan.target}</p>
          <p className="text-xs text-text-secondary capitalize">{scan.scan_type} scan</p>
        </div>
        <Badge tone={statusTone[scan.status]}>{SCAN_STATUS_LABEL[scan.status]}</Badge>
      </div>

      {isActive && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
        </div>
      )}

      {scan.status === "failed" && scan.error_message && (
        <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">
          {scan.error_message}
        </p>
      )}

      {scan.status === "completed" && (
        <p className="mt-3 text-xs text-text-secondary">
          Found {scan.results.length} open port{scan.results.length === 1 ? "" : "s"} across{" "}
          {new Set(scan.results.map((r) => r.asset_id)).size} host(s).
        </p>
      )}
    </Card>
  );
}
