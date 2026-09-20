export type ScanType = "quick" | "full";
export type ScanStatus = "pending" | "running" | "completed" | "failed";

export interface ScanResult {
  id: number;
  asset_id: number;
  port: number;
  protocol: string;
  service_name: string | null;
  banner: string | null;
}

export interface Scan {
  id: number;
  target: string;
  scan_type: ScanType;
  status: ScanStatus;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface ScanDetail extends Scan {
  results: ScanResult[];
}

export interface ScanCreatePayload {
  target: string;
  scan_type: ScanType;
}
