import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import PortTable from "@/components/scanner/PortTable";
import type { AssetDetail } from "@/types/asset";
import { formatDate } from "@/utils/formatDate";

export default function AssetDetails({ asset }: { asset: AssetDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-lg text-text-primary">{asset.ip_address}</p>
            <p className="text-sm text-text-secondary">{asset.hostname || "Unknown hostname"}</p>
          </div>
          <Badge tone={asset.status === "up" ? "success" : "danger"}>{asset.status}</Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-text-secondary">Operating System</p>
            <p className="text-text-primary">{asset.os_guess || "Unknown"}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">First Seen</p>
            <p className="text-text-primary">{formatDate(asset.first_seen)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Last Seen</p>
            <p className="text-text-primary">{formatDate(asset.last_seen)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-text-primary">
          Open Ports &amp; Services ({asset.services.length})
        </h3>
        <PortTable
          results={asset.services.map((s) => ({
            id: s.id,
            asset_id: asset.id,
            port: s.port,
            protocol: s.protocol,
            service_name: s.service_name,
            banner: s.banner,
          }))}
        />
      </Card>
    </div>
  );
}
