import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import EmptyState from "@/components/common/EmptyState";
import { Server } from "lucide-react";
import type { Asset } from "@/types/asset";
import { formatDate } from "@/utils/formatDate";

export default function RecentAssets({ assets }: { assets: Asset[] }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Recently Discovered Assets</h3>
        <Link to="/assets" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {assets.length === 0 ? (
        <EmptyState
          icon={<Server className="h-5 w-5" />}
          title="No assets discovered"
          description="Assets appear here automatically after your first scan completes."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {assets.slice(0, 5).map((asset) => (
            <Link
              key={asset.id}
              to={`/asset/${asset.id}`}
              className="flex items-center justify-between py-3 hover:opacity-80"
            >
              <div>
                <p className="font-mono text-sm text-text-primary">{asset.ip_address}</p>
                <p className="text-xs text-text-secondary">{asset.hostname || "Unknown hostname"}</p>
              </div>
              <span className="text-xs text-text-secondary">{formatDate(asset.last_seen)}</span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
