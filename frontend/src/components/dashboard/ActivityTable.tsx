import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import type { Asset } from "@/types/asset";
import { formatRelativeTime } from "@/utils/formatDate";

import { Server } from "lucide-react";

export function ActivityTable({ assets }: { assets: Asset[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border">

        <h3 className="text-sm font-semibold text-text-primary">Recently Discovered Assets</h3>
      </div>
      {assets.length === 0 ? (
        <EmptyState
          icon={<Server size={32} />}
          title="No assets discovered yet"
          description="Assets appear here automatically after your first scan."
        />
      ) : (
        <ul className="divide-y divide-border">
          {assets.slice(0, 5).map((asset) => (
            <li key={asset.id}>
              <Link
                to={`/assets/${asset.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">{asset.ip_address}</p>
                  <p className="text-xs text-text-secondary">
                    {asset.hostname || "Unknown host"} &middot; {formatRelativeTime(asset.last_seen)}
                  </p>
                </div>
                <Badge tone={asset.status === "up" ? "success" : "danger"}>{asset.status}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
