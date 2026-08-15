import { ReactNode } from "react";
import Card from "@/components/common/Card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: "primary" | "secondary" | "success" | "warning";
}

const toneClasses = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
};

export default function StatCard({ label, value, icon, tone = "primary" }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
        <p className="mt-0.5 font-mono text-2xl font-semibold text-text-primary">{value}</p>
      </div>
    </Card>

  );
}
