import Card from "@/components/common/Card";
import ReportTable from "@/components/reports/ReportTable";
import Spinner from "@/components/common/Spinner";
import { useReports } from "@/hooks/useReports";

export default function Reports() {
  const { reports, isLoading, error } = useReports();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Reports</h1>
        <p className="text-sm text-text-secondary">Export scan results to CSV or JSON.</p>
      </div>

      <Card className="p-5">
        {isLoading ? (
          <Spinner label="Loading reports..." />
        ) : error ? (
          <p className="py-8 text-center text-sm text-danger">{error}</p>
        ) : (
          <ReportTable reports={reports} />
        )}
      </Card>
    </div>
  );
}
