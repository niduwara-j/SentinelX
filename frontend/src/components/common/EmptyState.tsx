import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="rounded-full bg-white/5 p-3 text-text-secondary">{icon}</div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}
