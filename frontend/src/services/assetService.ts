import api from "./api";
import type { Asset, AssetDetail } from "@/types/asset";

export const assetService = {
  async listAssets(): Promise<Asset[]> {
    const { data } = await api.get<Asset[]>("/assets");
    return data;
  },

  async getAsset(id: number): Promise<AssetDetail> {
    const { data } = await api.get<AssetDetail>(`/assets/${id}`);
    return data;
  },
};

