import { useCallback, useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import type { Report } from "@/types/report";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportService.listReports();
      setReports(data);
    } catch {
      setError("Couldn't load reports. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { reports, isLoading, error, refresh };
}
