import UserDropdown from "./UserDropdown";

export default function Navbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-sidebar px-6">
      <div className="text-sm font-medium text-text-secondary">
        Security Operations Center
      </div>
      <div className="flex items-center gap-4">
        <UserDropdown />
      </div>
    </header>
  );
}

