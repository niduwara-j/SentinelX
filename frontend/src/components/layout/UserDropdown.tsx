import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  ChevronDown,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key and return focus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        id="user-profile-menu-button"
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all outline-none ${
          isOpen
            ? "border-primary bg-primary/15 text-primary ring-1 ring-primary"
            : "border-border bg-card/60 text-text-primary hover:border-primary/40 hover:bg-card"
        }`}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary shrink-0">
          <UserIcon className="h-4 w-4" />
        </div>
        <span className="max-w-[120px] sm:max-w-[180px] truncate font-medium">
          {user?.username || "Analyst"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-profile-menu-button"
          className="absolute right-0 mt-2 w-60 origin-top-right rounded-xl border border-border bg-card p-1.5 shadow-xl ring-1 ring-black/40 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User Info Header */}
          <div className="px-3 py-2.5 border-b border-border/80">
            <p className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">
              Signed in as
            </p>
            <p className="font-semibold text-text-primary text-sm truncate mt-0.5">
              {user?.username}
            </p>
            {user?.email && (
              <p className="text-xs text-text-secondary truncate mt-0.5">
                {user.email}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate("/settings")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary/15 hover:text-primary transition-colors text-left"
            >
              <Shield className="h-4 w-4 text-text-secondary" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate("/settings")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary/15 hover:text-primary transition-colors text-left"
            >
              <Settings className="h-4 w-4 text-text-secondary" />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Divider & Logout */}
          <div className="pt-1 border-t border-border/80">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-danger/15 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
