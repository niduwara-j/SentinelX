import { Outlet } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold text-text-primary">SentinelX</h1>
          <p className="text-sm text-text-secondary">Security Operations Center</p>

        </div>
        <Outlet />
      </div>
    </div>
  );
}
