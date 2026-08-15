import api from "./api";
import type { Scan, ScanDetail, ScanCreatePayload } from "@/types/scan";

export const scanService = {
  async startScan(payload: ScanCreatePayload): Promise<Scan> {
    const { data } = await api.post<Scan>("/scans", payload);
    return data;
  },

  async listScans(): Promise<Scan[]> {
    const { data } = await api.get<Scan[]>("/scans");
    return data;
  },

  async getScan(id: number): Promise<ScanDetail> {
    const { data } = await api.get<ScanDetail>(`/scans/${id}`);
    return data;
  },
};

