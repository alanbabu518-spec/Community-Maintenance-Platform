import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        w-full
        bg-[#eee]
        border-none
        outline-none
        rounded-lg
        px-[15px]
        py-[11px]
        text-[13px]
        my-1
        ${className}
      `}
      {...props}
    />
  );
}

export default Input;