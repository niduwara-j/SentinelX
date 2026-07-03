import api from './api'

export interface Asset {
  id: number
  ip_address: string
  hostname: string
  os: string
  status: string
  ports: number
  services: string[]
  last_seen: string
}

export const assetService = {
  getAssets: async (): Promise<Asset[]> => {
    const response = await api.get('/assets')
    return response.data
  },

  getAsset: async (id: number): Promise<Asset> => {
    const response = await api.get(`/asset/${id}`)
    return response.data
  },
}