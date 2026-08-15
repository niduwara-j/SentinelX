import SearchBar from "@/components/common/SearchBar";

interface AssetFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "up" | "down";
  onStatusFilterChange: (value: "all" | "up" | "down") => void;
}

export default function AssetFilters({
  search, onSearchChange, statusFilter, onStatusFilterChange,
}: AssetFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex-1">
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search by IP or hostname..." />
      </div>
      <div className="flex gap-2">
        {(["all", "up", "down"] as const).map((status) => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${
              statusFilter === status
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-text-secondary hover:bg-white/5"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
