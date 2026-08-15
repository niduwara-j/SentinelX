import { Loader2 } from "lucide-react";

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-text-secondary">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
