import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from "chart.js";
import Card from "@/components/common/Card";
import type { Asset } from "@/types/asset";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface PortsChartProps {
  portCounts: Record<number, number>;
}

export default function PortsChart({ portCounts }: PortsChartProps) {
  const entries = Object.entries(portCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const data = {
    labels: entries.map(([port]) => port),
    datasets: [
      {
        data: entries.map(([, count]) => count),
        backgroundColor: "#7C3AED",
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">Open Port Distribution</h3>
      {entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-text-secondary">No port data yet.</p>
      ) : (
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false }, ticks: { color: "#94A3B8", font: { family: "JetBrains Mono" } } },
              y: { grid: { color: "#334155" }, ticks: { color: "#94A3B8" }, beginAtZero: true },
            },
          }}
        />
      )}
    </Card>
  );
}
