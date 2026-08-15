import { useState, FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { authService } from "@/services/authService";
import { KeyRound, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Password reset token is missing from the URL.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || "Password reset token is invalid, expired, or already used.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Card className="p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger mx-auto mb-3">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-base font-semibold text-text-primary">Invalid Reset Link</h2>
        <p className="text-xs text-text-secondary mt-1">
          No verification token was found in this link. Please request a new password reset.
        </p>
        <Link
          to="/forgot-password"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Request Password Reset
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {isSuccess ? (
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Password Reset Complete</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Your password has been changed successfully. Redirecting you to sign in...
          </p>
          <Link
            to="/login"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-base font-semibold text-text-primary">Set New Password</h2>
            <p className="text-xs text-text-secondary mt-1">
              Please enter your new strong password below.
            </p>
          </div>

          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" isLoading={isSubmitting} icon={<KeyRound className="h-4 w-4" />}>
            Update Password
          </Button>

          <p className="mt-2 text-center text-sm text-text-secondary">
            <Link to="/login" className="font-medium text-primary hover:underline">
              Back to Sign In
            </Link>
          </p>
        </form>
      )}
    </Card>
  );
}
