import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, UsersRound } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

import PageTransition from "../components/ui/PageTransition";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/apiClient";

function AnimatedLines() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 500 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-slate-600"
      >
        <path
          className="auth-line"
          d="M-80 260 C 100 300 160 310 270 370 C 350 415 400 490 540 620"
        />
        <path
          className="auth-line"
          d="M-80 275 C 100 315 165 325 275 385 C 355 430 410 505 550 635"
        />
        <path
          className="auth-line"
          d="M-80 290 C 100 330 170 340 280 400 C 360 445 420 520 560 650"
        />
        <path
          className="auth-line"
          d="M-80 305 C 100 345 175 355 285 415 C 365 460 430 535 570 665"
        />
        <path
          className="auth-line"
          d="M-80 320 C 100 360 180 370 290 430 C 370 475 440 550 580 680"
        />
        <path
          className="auth-line"
          d="M-80 335 C 100 375 185 385 295 445 C 375 490 450 565 590 695"
        />
        <path
          className="auth-line"
          d="M-80 350 C 100 390 190 400 300 460 C 380 505 460 580 600 710"
        />
        <path
          className="auth-line"
          d="M-80 365 C 100 405 195 415 305 475 C 385 520 470 595 610 725"
        />
        <path
          className="auth-line"
          d="M-80 380 C 100 420 200 430 310 490 C 390 535 480 610 620 740"
        />
      </g>
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const googleError = searchParams.get("error");

  const googleErrorMessage =
    googleError === "no-account"
      ? "No CommunityCare account found. Please create an account first."
      : null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email.trim(), password);

      if (loggedInUser.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (loggedInUser.role === "MANAGER") {
        navigate("/manager/dashboard", { replace: true });
      } else if (loggedInUser.role === "TECHNICIAN") {
        navigate("/technician/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error instanceof ApiError) {
        if (error.status === 401) {
          setError("Invalid email or password");
        } else if (error.status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else if (error.status === 0) {
          setError("Unable to connect to the server. Please try again.");
        } else {
          setError(error.message);
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-6 sm:px-6">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0d0d0d] shadow-2xl lg:grid-cols-[42%_58%]">
          <section className="relative hidden min-h-570px overflow-hidden bg-[#111111] lg:block">
            <AnimatedLines />

            <div className="relative z-10 flex h-full flex-col justify-between p-7">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex w-fit items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 text-sm font-bold text-white">
                  <UsersRound size={22} />
                </div>

                <span className="text-base font-semibold text-white">
                  CommunityCare
                </span>
              </button>

              <div className="max-w-sm">
                <p className="text-lg leading-7 text-slate-200">
                  “A simpler way to report, track, and resolve community
                  maintenance issues.”
                </p>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-white">
                    CommunityCare
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Community Maintenance Platform
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-570px items-center justify-center px-6 py-7 sm:px-10">
            <div className="w-full max-w-390px">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Home
              </button>

              <div className="mb-5">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Sign In or Join Now!
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                  Login to your CommunityCare account.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${
                      import.meta.env.VITE_API_BASE_URL
                    }/auth/google`;
                  }}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <FcGoogle size={18} />
                  Google
                </button>

                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  <FaFacebookF size={15} className="text-[#1877F2]" />
                  Facebook
                </button>
              </div>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />

                <span className="text-[10px] text-slate-600">OR</span>

                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="login-email"
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
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-10.5 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-xs font-medium text-slate-400"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-10.5 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-10 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-slate-500 transition hover:text-white hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {(googleErrorMessage || error) && (
                  <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                    {googleErrorMessage || error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10.5 w-full items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Signing In...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-slate-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register", { state: { from } })}
                  className="font-semibold text-slate-300 transition hover:text-white"
                >
                  Create one
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;
