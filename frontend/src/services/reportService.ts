import api from "./api";
import type { Report, ReportDetail } from "@/types/report";

export const reportService = {
  async listReports(): Promise<Report[]> {
    const { data } = await api.get<Report[]>("/reports");
    return data;
  },

  async getReport(id: number): Promise<ReportDetail> {
    const { data } = await api.get<ReportDetail>(`/reports/${id}`);
    return data;
  },

  downloadUrl(id: number, format: "csv" | "json"): string {
    // Direct download link - browser will follow it with the token unavailable,
    // so instead we fetch as a blob (see reportService.download below) for
    // authenticated downloads.
    return `${api.defaults.baseURL}/reports/${id}/${format}`;
  },

  async download(id: number, format: "csv" | "json"): Promise<void> {
    const response = await api.get(`/reports/${id}/${format}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `scan_${id}_report.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
