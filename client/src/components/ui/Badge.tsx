import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export default Badge;