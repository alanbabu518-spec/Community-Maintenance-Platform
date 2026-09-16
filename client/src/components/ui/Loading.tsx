interface LoadingProps {
  type?: "dashboard" | "list";
}

function Loading({ type = "dashboard" }: LoadingProps) {
  if (type === "list") {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900"
          >
            <div className="mb-3 h-5 w-2/5 rounded bg-gray-200 dark:bg-slate-700" />
            <div className="mb-2 h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
            <div className="mb-4 h-3 w-4/5 rounded bg-gray-200 dark:bg-slate-700" />

            <div className="flex gap-3">
              <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-slate-700" />
              <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-slate-700" />
              <div className="h-6 w-20 rounded-full bg-gray-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="mb-3 h-8 w-40 rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-4 w-72 rounded bg-gray-200 dark:bg-slate-700" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900"
          >
            <div className="mb-4 h-4 w-24 rounded bg-gray-200 dark:bg-slate-700" />
            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 h-6 w-56 rounded bg-gray-200 dark:bg-slate-700" />

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900"
            >
              <div className="mb-3 h-5 w-2/5 rounded bg-gray-200 dark:bg-slate-700" />
              <div className="mb-2 h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;