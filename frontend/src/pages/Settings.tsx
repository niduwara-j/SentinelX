import { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import type { UserPreferences } from "@/types/user";
import {
  User as UserIcon,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Lock,
  Edit2,
  X,
  ExternalLink,
  Radar,
} from "lucide-react";

export default function Settings() {
  const { user, updateUser, refreshUser } = useAuth();

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Preferences State (Default Scan Type)
  const [preferences, setPreferences] = useState<UserPreferences>({
    default_scan_type: "quick",
  });
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [prefsSuccess, setPrefsSuccess] = useState("");
  const [prefsError, setPrefsError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const data = await authService.getPreferences();
        setPreferences({
          default_scan_type: data.default_scan_type || "quick",
        });
      } catch {
        // Fallback to defaults
      }
    }
    loadPrefs();
  }, []);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileLoading(true);

    try {
      const updated = await authService.updateProfile({
        username: username !== user?.username ? username : undefined,
        email: email !== user?.email ? email : undefined,
      });
      updateUser(updated);
      await refreshUser();
      setProfileSuccess("Account profile updated successfully.");
      setIsEditingProfile(false);
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        "Failed to update profile. Username or email may already be taken.";
      setProfileError(msg);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await authService.changePassword(currentPassword, newPassword);
      setPwSuccess(res.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err.response?.data?.error?.message ||
        "Failed to change password. Current password is incorrect.";
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const handleScanTypeChange = async (scanType: "quick" | "full") => {
    const updatedPrefs = { ...preferences, default_scan_type: scanType };
    setPreferences(updatedPrefs);
    setPrefsSuccess("");
    setPrefsError("");
    setPrefsLoading(true);

    try {
      const res = await authService.updatePreferences({ default_scan_type: scanType });
      setPreferences(res);
      setPrefsSuccess("Default scan profile saved.");
      setTimeout(() => setPrefsSuccess(""), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || "Failed to save preference.";
      setPrefsError(msg);
    } finally {
      setPrefsLoading(false);
    }
  };

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Account Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage your enterprise security profile, credentials, and scan preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Account Information Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-text-primary">Account Profile</h3>
              </div>
              {!isEditingProfile ? (
                <Button
                  variant="secondary"
                  className="py-1 px-3 text-xs"
                  onClick={() => {
                    setUsername(user?.username || "");
                    setEmail(user?.email || "");
                    setIsEditingProfile(true);
                  }}
                  icon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  Edit Profile
                </Button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors p-1"
                  title="Cancel edit"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {profileSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-success/15 border border-success/30 p-2.5 text-xs text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mb-4 text-xs text-danger">{profileError}</div>
            )}

            {!isEditingProfile ? (
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2.5">
                  <dt className="text-text-secondary text-xs">Username</dt>
                  <dd className="font-mono text-text-primary font-medium">{user?.username}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2.5">
                  <dt className="text-text-secondary text-xs">Email Address</dt>
                  <dd className="text-text-primary">{user?.email}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2.5">
                  <dt className="text-text-secondary text-xs">Account Status</dt>
                  <dd className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-success"></span> Active
                  </dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt className="text-text-secondary text-xs">Member Since</dt>
                  <dd className="text-text-secondary font-mono text-xs">{formattedDate}</dd>
                </div>
              </dl>
            ) : (
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3.5 mt-2">
                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={50}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button type="submit" isLoading={profileLoading} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-border/60">
            <p className="text-[11px] text-text-secondary">
              Identity ownership is tied to your persistent user ID. Changing your username or email preserves all historical scans, assets, and reports.
            </p>
          </div>
        </Card>

        {/* 2. Security & Credentials Card */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">Security & Credentials</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {pwError && <p className="text-xs text-danger">{pwError}</p>}

              {pwSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-success/15 border border-success/30 p-2.5 text-xs text-success">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{pwSuccess}</span>
                </div>
              )}

              <Button
                type="submit"
                isLoading={pwLoading}
                icon={<Lock className="h-4 w-4" />}
                className="mt-1"
              >
                Change Password
              </Button>
            </form>
          </div>

          <div className="mt-6 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-text-secondary">Forgot your credentials?</span>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Password Recovery <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </Card>

        {/* 3. Platform Preferences Card */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold text-text-primary">Platform Preferences</h3>
            </div>
            {prefsSuccess && (
              <span className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> {prefsSuccess}
              </span>
            )}
            {prefsError && <span className="text-xs text-danger">{prefsError}</span>}
          </div>

          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <Radar className="h-4 w-4 text-text-secondary" />
              <span>Default Scan Profile</span>
            </div>
            <p className="text-xs text-text-secondary mb-2">
              Pre-selected scan mode when opening the Network Scan console.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleScanTypeChange("quick")}
                className={`flex flex-col items-start p-3 rounded-lg border text-left text-xs transition-all ${
                  preferences.default_scan_type === "quick"
                    ? "border-primary bg-primary/15 text-primary ring-1 ring-primary font-medium"
                    : "border-border bg-card text-text-secondary hover:border-text-secondary/50"
                }`}
              >
                <span className="font-semibold text-text-primary">Quick Scan</span>
                <span className="text-[11px] text-text-secondary mt-0.5">Top essential service ports</span>
              </button>

              <button
                type="button"
                onClick={() => handleScanTypeChange("full")}
                className={`flex flex-col items-start p-3 rounded-lg border text-left text-xs transition-all ${
                  preferences.default_scan_type === "full"
                    ? "border-primary bg-primary/15 text-primary ring-1 ring-primary font-medium"
                    : "border-border bg-card text-text-secondary hover:border-text-secondary/50"
                }`}
              >
                <span className="font-semibold text-text-primary">Full Scan</span>
                <span className="text-[11px] text-text-secondary mt-0.5">Comprehensive port range</span>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            <p className="text-[11px] text-text-secondary leading-relaxed">
              * Preferences configure your local dashboard defaults. Server-side security limits (<code className="text-primary font-mono">SCAN_TIMEOUT_SECONDS=300</code>, <code className="text-primary font-mono">MAX_ACTIVE_SCANS=1</code>) remain strictly enforced.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
