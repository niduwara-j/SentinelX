import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AssetDetails from "@/components/assets/AssetDetails";
import Spinner from "@/components/common/Spinner";
import { assetService } from "@/services/assetService";
import type { AssetDetail as AssetDetailType } from "@/types/asset";

export default function AssetDetail() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<AssetDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    assetService
      .getAsset(Number(id))
      .then(setAsset)
      .catch(() => setError("Couldn't load this asset."))
      .finally(() => setIsLoading(false));
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/assets" className="flex w-fit items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft className="h-4 w-4" />
        Back to Assets
      </Link>

      {isLoading ? (
        <Spinner label="Loading asset..." />
      ) : error || !asset ? (
        <p className="text-sm text-danger">{error || "Asset not found."}</p>
      ) : (
        <AssetDetails asset={asset} />
      )}
    </div>
  );
}
