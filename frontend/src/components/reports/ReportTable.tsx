import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import DownloadButtons from "./DownloadButtons";
import { FileX } from "lucide-react";
import type { Report } from "@/types/report";
import { formatDate } from "@/utils/formatDate";

export default function ReportTable({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return (
      <EmptyState
        icon={<FileX className="h-5 w-5" />}
        title="No reports yet"
        description="Reports are generated automatically once a scan completes."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
            <th className="py-2 pr-4 font-medium">Target</th>
            <th className="py-2 pr-4 font-medium">Scan Type</th>
            <th className="py-2 pr-4 font-medium">Completed</th>
            <th className="py-2 pr-4 font-medium">Download</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="py-3 pr-4 font-mono text-text-primary">{report.target}</td>
              <td className="py-3 pr-4">
                <Badge tone="info">{report.scan_type}</Badge>
              </td>
              <td className="py-3 pr-4 text-xs text-text-secondary">{formatDate(report.finished_at)}</td>
              <td className="py-3 pr-4">
                <DownloadButtons reportId={report.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
