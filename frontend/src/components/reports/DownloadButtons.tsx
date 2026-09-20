import { useState } from "react";
import { Download } from "lucide-react";
import { reportService } from "@/services/reportService";

export default function DownloadButtons({ reportId }: { reportId: number }) {
  const [downloading, setDownloading] = useState<"csv" | "json" | null>(null);

  const handleDownload = async (format: "csv" | "json") => {
    setDownloading(format);
    try {
      await reportService.download(reportId, format);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="flex gap-2">
      {(["csv", "json"] as const).map((format) => (
        <button
          key={format}
          onClick={() => handleDownload(format)}
          disabled={downloading === format}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium
            uppercase text-text-secondary transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          {format}
        </button>
      ))}
    </div>
  );
}
