import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Card from "@/components/common/Card";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { authService } from "@/services/authService";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message || "If an account exists for this email, a password reset link has been sent.");
      setSubmitted(true);
    } catch (err: any) {
      // Keep messaging safe and generic
      const msg = err.response?.data?.error?.message || "An error occurred while processing your request. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      {submitted ? (
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">Check your email</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {message}
          </p>

          <div className="w-full rounded-lg bg-white/5 border border-border p-3 text-left mt-2">
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="text-primary font-medium">Local Development:</span> If no external SMTP server is configured in your <code className="text-white">.env</code>, your single-use reset link is printed directly to the server logs (<code className="text-white">docker logs sentinelx_backend</code>).
            </p>
          </div>

          <Link
            to="/login"
            className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        </div>

      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-base font-semibold text-text-primary">Reset your password</h2>
            <p className="text-xs text-text-secondary mt-1">
              Enter your verified email address and we will dispatch password recovery instructions.
            </p>
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="analyst@sentinelx.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" isLoading={isSubmitting} icon={<Mail className="h-4 w-4" />}>
            Send Reset Instructions
          </Button>

          <p className="mt-2 text-center text-sm text-text-secondary">
            Remembered your password?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      )}
    </Card>
  );
}
