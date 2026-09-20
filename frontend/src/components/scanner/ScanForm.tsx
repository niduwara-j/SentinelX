import { useState, useEffect, FormEvent } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { Radar } from "lucide-react";
import type { ScanType } from "@/types/scan";
import { isValidTarget } from "@/utils/validators";
import { authService } from "@/services/authService";

interface ScanFormProps {
  onSubmit: (target: string, scanType: ScanType) => void;
  isSubmitting: boolean;
}

export default function ScanForm({ onSubmit, isSubmitting }: ScanFormProps) {
  const [target, setTarget] = useState("");
  const [scanType, setScanType] = useState<ScanType>("quick");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUserDefault() {
      try {
        const prefs = await authService.getPreferences();
        if (prefs?.default_scan_type) {
          setScanType(prefs.default_scan_type as ScanType);
        }
      } catch {
        // Fallback to quick
      }
    }
    loadUserDefault();
  }, []);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!target.trim()) {
      setError("Enter a target to scan.");
      return;
    }
    if (!isValidTarget(target.trim())) {
      setError("Enter a valid IP, CIDR range (e.g. 192.168.1.0/24), or hostname.");
      return;
    }
    setError("");
    onSubmit(target.trim(), scanType);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Target"
        placeholder="127.0.0.1 or 192.168.1.0/24"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        error={error}
        mono
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-secondary">Scan Type</span>
        <div className="flex gap-2">
          {(["quick", "full"] as ScanType[]).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setScanType(type)}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                scanType === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-secondary hover:bg-white/5"
              }`}
            >
              {type} Scan
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting} icon={<Radar className="h-4 w-4" />}>
        Start Scan
      </Button>
    </form>
  );
}
