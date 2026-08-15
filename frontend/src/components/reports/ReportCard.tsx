import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import DownloadButtons from "./DownloadButtons";

import type { Report } from "@/types/report";
import { formatDate } from "@/utils/formatDate";

export function ReportCard({ report }: { report: Report }) {
  return (
    <Card className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="text-sm font-medium text-text-primary font-mono">{report.target}</p>
        <p className="text-xs text-text-secondary mt-0.5">
          {report.scan_type} scan &middot; {formatDate(report.finished_at)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge tone="success">completed</Badge>
        <DownloadButtons reportId={report.id} />
      </div>
    </Card>
  );
}
