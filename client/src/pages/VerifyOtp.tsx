import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { verifyOtp } from "../services/auth.api";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import PageTransition from "../components/ui/PageTransition";

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

function VerifyOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);
    setError("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const newOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await verifyOtp({
        email,
        otp: otpValue,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "OTP verification failed",
      );
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
                  “One more step to secure your CommunityCare account.”
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
                onClick={() => navigate("/register")}
                className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Back to Registration
              </button>

              <div className="mb-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-[#090909] text-slate-300">
                  <ShieldCheck size={19} />
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Verify Your Email
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                  Enter the 6-digit verification code sent to your email.
                </p>
              </div>

              <div className="mb-6 flex items-center gap-2 rounded-lg border border-slate-800 bg-[#090909] px-3 py-2.5">
                <Mail size={16} className="shrink-0 text-slate-600" />

                <p className="min-w-0 break-all text-xs font-medium text-slate-300">
                  {email || "Email address"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="mb-2 text-xs font-medium text-slate-400">
                  Verification code
                </label>

                <div className="flex justify-center gap-2 sm:justify-start sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) =>
                        handleChange(index, event.target.value)
                      }
                      onKeyDown={(event) => handleKeyDown(index, event)}
                      onPaste={handlePaste}
                      aria-label={`OTP digit ${index + 1}`}
                      className="h-12 w-10 rounded-lg border border-slate-800 bg-[#090909] text-center text-lg font-semibold text-white outline-none transition placeholder:text-slate-700 focus:border-slate-600 focus:ring-2 focus:ring-slate-600/20 sm:h-14 sm:w-12"
                    />
                  ))}
                </div>

                {error && (
                  <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="mt-6 h-10.5 w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="sm" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </form>

              <p className="mt-5 text-center text-xs text-slate-600">
                Entered the wrong email?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-semibold text-slate-300 transition hover:text-white"
                >
                  Register again
                </button>
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-xs font-medium text-slate-500 transition hover:text-white"
                >
                  Already verified? Sign in
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

export default VerifyOtp;