import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Lock,
  UserRound,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { registerUser } from "../services/auth.api";
import Spinner from "../components/ui/Spinner";
import PageTransition from "../components/ui/PageTransition";

type UserRole = "ADMIN" | "MANAGER" | "RESIDENT" | "TECHNICIAN";

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

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("RESIDENT");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

      await registerUser({
        name,
        email,
        password,
        role,
      });

      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 py-6 sm:px-6">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-[#0d0d0d] shadow-2xl lg:grid-cols-[42%_58%]">
          <section className="relative hidden min-h-610px overflow-hidden bg-[#111111] lg:block">
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
                  “Connect residents, management teams, and technicians through
                  one simple maintenance platform.”
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

          <section className="flex min-h-610px items-center justify-center px-6 py-6 sm:px-10">
            <div className="w-full max-w-390px">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Home
              </button>

              <div className="mb-4">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Create your account
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                  Join CommunityCare and get started.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
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

              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[10px] text-slate-600">OR</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label
                    htmlFor="register-name"
                    className="mb-1.5 block text-xs font-medium text-slate-400"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <UserRound
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <input
                      id="register-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="h-10 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="register-email"
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
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-10 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="register-password"
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
                      id="register-password"
                      type="password"
                      placeholder="Password (min 8 characters)"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={8}
                      className="h-10 w-full rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="register-role"
                    className="mb-1.5 block text-xs font-medium text-slate-400"
                  >
                    Account role
                  </label>

                  <div className="relative">
                    <ShieldCheck
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                    />

                    <select
                      id="register-role"
                      value={role}
                      onChange={(event) =>
                        setRole(event.target.value as UserRole)
                      }
                      className="h-10 w-full appearance-none rounded-lg border border-slate-800 bg-[#090909] pl-9 pr-3 text-sm text-white outline-none transition focus:border-slate-600"
                    >
                      <option value="RESIDENT">Resident</option>
                      <option value="TECHNICIAN">Technician</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                    {error}
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
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-slate-300 transition hover:text-white"
                >
                  Sign In
                </button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default Register;