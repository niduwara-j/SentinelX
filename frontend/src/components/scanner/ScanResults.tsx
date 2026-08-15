import Card from "@/components/common/Card";
import PortTable from "./PortTable";
import type { ScanDetail } from "@/types/scan";

export default function ScanResults({ scan }: { scan: ScanDetail }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Results</h3>
      <PortTable results={scan.results} />
    </Card>
  );
}
