interface StatCardProps {
  title: string;
  value: number;
  description?: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

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