import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <select
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
        text-gray-700
        focus:ring-2
        focus:ring-[#2da0a8]/20
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
