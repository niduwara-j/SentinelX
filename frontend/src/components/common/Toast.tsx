import { useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export interface ToastData {
  id: number;
  message: string;
  tone: "success" | "error";
}

interface ToastProps extends ToastData {
  onDismiss: (id: number) => void;
}

export default function Toast({ id, message, tone, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const Icon = tone === "success" ? CheckCircle2 : XCircle;
  const toneClass = tone === "success" ? "text-success" : "text-danger";

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 shadow-card">
      <Icon className={`h-4 w-4 shrink-0 ${toneClass}`} />
      <span className="text-sm text-text-primary">{message}</span>
      <button onClick={() => onDismiss(id)} className="ml-2 text-text-secondary hover:text-text-primary">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
