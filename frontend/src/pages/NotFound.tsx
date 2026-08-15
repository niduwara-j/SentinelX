import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg text-center">
      <ShieldAlert className="h-10 w-10 text-primary" />
      <h1 className="text-2xl font-semibold text-white">404</h1>
      <p className="text-sm text-text-secondary">This page doesn't exist in SentinelX.</p>
      <Link to="/dashboard" className="mt-2 text-sm font-medium text-primary hover:underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
