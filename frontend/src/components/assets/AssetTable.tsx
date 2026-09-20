import { Link } from "react-router-dom";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { ServerOff } from "lucide-react";
import type { Asset } from "@/types/asset";
import { formatDate } from "@/utils/formatDate";

export default function AssetTable({ assets }: { assets: Asset[] }) {
  if (assets.length === 0) {
    return (
      <EmptyState
        icon={<ServerOff className="h-5 w-5" />}
        title="No assets match your filters"
        description="Try adjusting your search or run a new scan to discover more hosts."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
            <th className="py-2 pr-4 font-medium">IP Address</th>
            <th className="py-2 pr-4 font-medium">Hostname</th>
            <th className="py-2 pr-4 font-medium">OS</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium">Last Seen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-white/[0.02]">
              <td className="py-3 pr-4">
                <Link to={`/asset/${asset.id}`} className="font-mono text-text-primary hover:text-primary">
                  {asset.ip_address}
                </Link>
              </td>
              <td className="py-3 pr-4 text-text-secondary">{asset.hostname || "—"}</td>
              <td className="py-3 pr-4 text-text-secondary">{asset.os_guess || "Unknown"}</td>
              <td className="py-3 pr-4">
                <Badge tone={asset.status === "up" ? "success" : "danger"}>{asset.status}</Badge>
              </td>
              <td className="py-3 pr-4 text-xs text-text-secondary">{formatDate(asset.last_seen)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
