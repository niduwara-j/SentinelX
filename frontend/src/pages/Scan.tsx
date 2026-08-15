import ScanForm from "@/components/scanner/ScanForm";
import ScanProgress from "@/components/scanner/ScanProgress";
import ScanResults from "@/components/scanner/ScanResults";
import Card from "@/components/common/Card";
import { useScanner } from "@/hooks/useScanner";
import type { ScanType } from "@/types/scan";

export default function Scan() {
  const { activeScan, isStarting, error, startScan } = useScanner();

  const handleStart = (target: string, scanType: ScanType) => {
    startScan({ target, scan_type: scanType });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Network Scan</h1>
        <p className="text-sm text-text-secondary">

          Discover live hosts and open ports on a target IP, CIDR range, or hostname.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-text-primary">New Scan</h3>
          <ScanForm onSubmit={handleStart} isSubmitting={isStarting} />
          {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {activeScan ? (
            <>
              <ScanProgress scan={activeScan} />
              {activeScan.status === "completed" && <ScanResults scan={activeScan} />}
            </>
          ) : (
            <Card className="flex items-center justify-center p-10 text-sm text-text-secondary">
              Start a scan to see live progress and results here.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
