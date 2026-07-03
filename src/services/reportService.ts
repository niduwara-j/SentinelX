import api from './api'

export interface Report {
  id: number
  name: string
  type: string
  created_at: string
}

export const reportService = {
  getReports: async (): Promise<Report[]> => {
    const response = await api.get('/reports')
    return response.data
  },

  downloadReport: async (id: number, format: 'csv' | 'json'): Promise<Blob> => {
    const response = await api.get(`/reports/${id}?format=${format}`, {
      responseType: 'blob',
    })
    return response.data
  },
}