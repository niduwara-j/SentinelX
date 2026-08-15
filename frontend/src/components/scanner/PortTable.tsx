import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { ListX } from "lucide-react";
import type { ScanResult } from "@/types/scan";

export default function PortTable({ results }: { results: ScanResult[] }) {
  if (results.length === 0) {
    return (
      <EmptyState
        icon={<ListX className="h-5 w-5" />}
        title="No open ports found"
        description="This target didn't respond on any scanned ports."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
            <th className="py-2 pr-4 font-medium">Port</th>
            <th className="py-2 pr-4 font-medium">Protocol</th>
            <th className="py-2 pr-4 font-medium">Service</th>
            <th className="py-2 pr-4 font-medium">Banner</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {results.map((r) => (
            <tr key={r.id}>
              <td className="py-2.5 pr-4 font-mono text-text-primary">{r.port}</td>
              <td className="py-2.5 pr-4 text-text-secondary uppercase">{r.protocol}</td>
              <td className="py-2.5 pr-4">
                <Badge tone="info">{r.service_name || "unknown"}</Badge>
              </td>
              <td className="py-2.5 pr-4 max-w-xs truncate font-mono text-xs text-text-secondary">
                {r.banner || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
