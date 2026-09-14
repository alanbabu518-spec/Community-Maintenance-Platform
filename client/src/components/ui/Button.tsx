import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`
        bg-[#2da0a8]
        text-white
        text-xs
        px-[45px]
        py-[10px]
        border
        border-transparent
        rounded-lg
        font-semibold
        tracking-[0.5px]
        uppercase
        cursor-pointer
        hover:bg-[#248991]
        transition
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;