import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock, UsersRound } from "lucide-react";
import PageTransition from "../components/ui/PageTransition";
import Spinner from "../components/ui/Spinner";
import { resetPassword } from "../services/auth.api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password.length > 72) {
      setError("Password must be 72 characters or less.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await resetPassword({
        token,
        password,
      });

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid or expired reset link.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d0d0d] p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              ✓
            </div>

            <h1 className="text-2xl font-bold text-white">
              Password changed successfully
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Your CommunityCare password has been updated successfully.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-6 h-10.5 w-full rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-6 sm:px-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0d0d0d] shadow-2xl">
          <div className="p-7 sm:p-10">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to Sign In
            </button>

            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 text-sm font-bold text-white">
                  <UsersRound size={20} />
                </div>

                <span className="text-base font-semibold text-white">
                  CommunityCare
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                Reset Password
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Create a new password for your account.
              </p>
            </div>

            {!token && (
              <div className="mb-4 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                Invalid or missing password reset link.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="reset-password"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="reset-password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    maxLength={72}
                    disabled={!token || loading}
                    className="h-10.5 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />

                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    minLength={8}
                    maxLength={72}
                    disabled={!token || loading}
                    className="h-10.5 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!token || loading}
                className="flex h-10.5 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ResetPassword;
