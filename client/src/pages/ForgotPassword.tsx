import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

import PageTransition from "../components/ui/PageTransition";
import Spinner from "../components/ui/Spinner";
import { forgotPassword } from "../services/auth.api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email.trim());

      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-6 sm:px-6">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0d0d0d] shadow-2xl">
          <div className="flex min-h-570px items-center justify-center px-6 py-8 sm:px-10">
            <div className="w-full max-w-390px">
              <Link
                to="/login"
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to Login
              </Link>

              {!success ? (
                <>
                  <div className="mb-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[#111111]">
                      <Mail size={19} className="text-slate-300" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                      Forgot Password?
                    </h1>

                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      Enter your email address and we'll send you a password
                      reset link.
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="forgot-password-email"
                        className="mb-1.5 block text-xs font-medium text-slate-400"
                      >
                        Email address
                      </label>

                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                          id="forgot-password-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          disabled={loading}
                          className="h-10.5 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex h-10.5 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <Spinner size="sm" />
                          Sending...
                        </span>
                      ) : (
                        "Send Reset Link"
                      )}
                    </button>
                  </form>

                  <p className="mt-5 text-center text-xs text-slate-600">
                    Remember your password?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-slate-300 transition hover:text-white"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-green-900/40 bg-green-950/30">
                    <CheckCircle size={28} className="text-green-400" />
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-white">
                    Check Your Email
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    We've sent a password reset link to:
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-slate-200">
                    {email}
                  </p>

                  <p className="mt-5 text-xs leading-5 text-slate-600">
                    Check your inbox and click the reset link to create a new
                    password. The link will expire in 15 minutes.
                  </p>

                  <Link
                    to="/login"
                    className="mt-6 flex h-10.5 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ForgotPassword;