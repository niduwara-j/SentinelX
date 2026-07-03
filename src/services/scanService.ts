import api from './api'

export interface ScanData {
  target: string
  scan_type: 'quick' | 'full'
}

export interface ScanResult {
  id: number
  target: string
  scan_type: string
  status: string
  ports_found: number
  created_at: string
}

export const scanService = {
  startScan: async (data: ScanData): Promise<ScanResult> => {
    const response = await api.post('/scan', data)
    return response.data
  },

  getScans: async (): Promise<ScanResult[]> => {
    const response = await api.get('/scans')
    return response.data
  },

  getScanResult: async (id: number): Promise<any> => {
    const response = await api.get(`/scan/${id}`)
    return response.data
  },
}