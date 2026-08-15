import { useCallback, useEffect, useRef, useState } from "react";
import { scanService } from "@/services/scanService";
import type { Scan, ScanDetail, ScanCreatePayload } from "@/types/scan";

const POLL_INTERVAL_MS = 2000;

export function useScanner() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [activeScan, setActiveScan] = useState<ScanDetail | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshScans = useCallback(async () => {
    const data = await scanService.listScans();
    setScans(data);
  }, []);

  useEffect(() => {
    refreshScans();
  }, [refreshScans]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const pollScan = useCallback((scanId: number) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const detail = await scanService.getScan(scanId);
      setActiveScan(detail);
      if (detail.status === "completed" || detail.status === "failed") {
        stopPolling();
        refreshScans();
      }
    }, POLL_INTERVAL_MS);
  }, [stopPolling, refreshScans]);

  const startScan = useCallback(async (payload: ScanCreatePayload) => {
    setIsStarting(true);
    setError(null);
    try {
      const scan = await scanService.startScan(payload);
      const detail = await scanService.getScan(scan.id);
      setActiveScan(detail);
      pollScan(scan.id);
      return scan;
    } catch {
      setError("Couldn't start the scan. Check the target and try again.");
      return null;
    } finally {
      setIsStarting(false);
    }
  }, [pollScan]);

  useEffect(() => () => stopPolling(), [stopPolling]);

  return { scans, activeScan, isStarting, error, startScan, refreshScans };
}
