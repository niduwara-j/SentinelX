import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Card from "@/components/common/Card";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ServicesChartProps {
  serviceCounts: Record<string, number>;
}

const PALETTE = ["#7C3AED", "#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#A78BFA", "#60A5FA"];

export default function ServicesChart({ serviceCounts }: ServicesChartProps) {
  const entries = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);

  const data = {
    labels: entries.map(([name]) => name),
    datasets: [
      {
        data: entries.map(([, count]) => count),
        backgroundColor: PALETTE,
        borderWidth: 0,
      },
    ],
  };

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Most Common Services</h3>
      {entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">No service data yet.</p>
      ) : (
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                position: "right",
                labels: { color: "#94A3B8", boxWidth: 10, font: { size: 11 } },
              },
            },
          }}
        />
      )}
    </Card>
  );
}
