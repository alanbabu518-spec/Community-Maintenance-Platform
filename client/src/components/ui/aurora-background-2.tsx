"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuroraBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <main>
      <div
        className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-900 text-slate-200 ${className ?? ""}`}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-sky-400 via-rose-400 to-lime-400 opacity-20 blur-[120px]" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"
          />
        </div>

        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuroraBackground;