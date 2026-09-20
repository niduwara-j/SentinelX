import { useMemo, useState } from "react";
import Card from "@/components/common/Card";
import AssetFilters from "@/components/assets/AssetFilters";
import AssetTable from "@/components/assets/AssetTable";
import Pagination from "@/components/common/Pagination";
import Spinner from "@/components/common/Spinner";
import { useAssets } from "@/hooks/useAssets";

const PAGE_SIZE = 10;

export default function Assets() {
  const { assets, isLoading, error } = useAssets();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "up" | "down">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchesSearch =
        a.ip_address.toLowerCase().includes(search.toLowerCase()) ||
        (a.hostname || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Asset Inventory</h1>
        <p className="text-sm text-text-secondary">
Every host discovered across your scans.</p>
      </div>

      <Card className="p-5">
        <div className="mb-4">
          <AssetFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
          />
        </div>

        {isLoading ? (
          <Spinner label="Loading assets..." />
        ) : error ? (
          <p className="py-8 text-center text-sm text-danger">{error}</p>
        ) : (
          <>
            <AssetTable assets={paged} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
}
