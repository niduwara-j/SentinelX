import { useCallback, useEffect, useState } from "react";
import { assetService } from "@/services/assetService";
import type { Asset } from "@/types/asset";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await assetService.listAssets();
      setAssets(data);
    } catch {
      setError("Couldn't load assets. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { assets, isLoading, error, refresh };
}
