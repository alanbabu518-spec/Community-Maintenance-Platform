import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyOtp } from "../services/api";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import PageTransition from "../components/ui/PageTransition";

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

    if (!pastedValue) return;

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
      <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center px-4 py-6 font-['Montserrat']">
        <div
          className="
            w-full
            max-w-[900px]
            bg-white
            rounded-[30px]
            shadow-[0_5px_15px_rgba(0,0,0,0.35)]
            overflow-hidden
            flex
            flex-col
            md:flex-row
          "
        >
          <div
            className="
              w-full
              md:w-1/2
              min-h-[230px]
              md:min-h-[520px]
              bg-gradient-to-r
              from-[#2da0a8]
              to-[#5c6bc0]
              text-white
              flex
              items-center
              justify-center
              text-center
              px-8
              py-10
              rounded-b-[80px]
              md:rounded-b-none
              md:rounded-r-[150px]
            "
          >
            <div className="max-w-[300px]">
              <h1 className="text-3xl md:text-4xl font-bold">Almost There!</h1>

              <p className="text-sm leading-6 tracking-[0.3px] my-5">
                Verify your email address to complete your registration.
              </p>

              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="
                  bg-transparent
                  border-white
                  hover:bg-white
                  hover:text-[#2da0a8]
                "
              >
                Sign In
              </Button>
            </div>
          </div>

          <div
            className="
              w-full
              md:w-1/2
              flex
              items-center
              justify-center
              px-6
              sm:px-10
              py-10
              md:py-12
            "
          >
            <form
              onSubmit={handleSubmit}
              className="
                w-full
                max-w-[360px]
                flex
                flex-col
                items-center
              "
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Verify OTP
              </h1>

              <p className="text-xs text-gray-500 text-center mb-2">
                Enter the 6-digit code sent to
              </p>

              <p className="text-xs font-semibold text-gray-700 text-center mb-6 break-all">
                {email}
              </p>

              <div className="flex justify-center gap-2 sm:gap-3">
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
                    className="
                      w-10
                      h-12
                      sm:w-12
                      sm:h-14
                      text-center
                      text-lg
                      font-semibold
                      bg-[#eee]
                      border
                      border-transparent
                      rounded-lg
                      outline-none
                      text-gray-900
                      focus:border-[#2da0a8]
                      focus:ring-2
                      focus:ring-[#2da0a8]/20
                      transition
                    "
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
              )}

              <Button type="submit" className="mt-6" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Verifying...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                  text-xs
                  text-gray-500
                  hover:text-[#2da0a8]
                  hover:underline
                  mt-4
                  transition
                "
              >
                Back to Registration
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default VerifyOtp;
