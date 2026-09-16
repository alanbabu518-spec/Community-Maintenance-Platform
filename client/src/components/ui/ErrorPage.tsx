import React, { useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import AuroraBackground from "./Aurora-background-2";

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  errorCode?: string;
}

function ErrorPage({
  title = "Something went wrong",
  message = "We couldn't complete your request right now. Please try again.",
  onRetry,
  onBack,
  errorCode,
}: ErrorPageProps) {
  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AuroraBackground>
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto flex justify-center">
            <lottie-player
              src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
              background="transparent"
              speed="1"
              style={{ width: "250px", height: "250px" }}
              loop
              autoplay
            />
          </div>

          {errorCode && (
            <p className="text-6xl font-black tracking-tight text-white/90 sm:text-7xl">
              {errorCode}
            </p>
          )}

          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Error
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
            {message}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            )}
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}

export default ErrorPage;
