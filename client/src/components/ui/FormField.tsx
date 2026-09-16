import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {children}

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;