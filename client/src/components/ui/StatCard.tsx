import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon?: LucideIcon;
  accent?: "slate" | "blue" | "purple" | "emerald";
}

const accentStyles = {
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
};

function StatCard({ title, value, description, icon: Icon, accent = "slate" }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        {Icon && (
          <div className={`rounded-xl p-2 ${accentStyles[accent]}`}>
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </div>
        )}
      </div>

      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;