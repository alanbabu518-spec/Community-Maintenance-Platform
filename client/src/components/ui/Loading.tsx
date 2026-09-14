interface LoadingProps {
  type?: "dashboard" | "list";
}

function Loading({ type = "dashboard" }: LoadingProps) {
  if (type === "list") {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="h-5 bg-gray-200 rounded w-2/5 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-full mb-2" />
            <div className="h-3 bg-gray-200 rounded w-4/5 mb-4" />

            <div className="flex gap-3">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 rounded w-40 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-72" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl p-5 shadow-sm"
          >
            <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>

      <div>
        <div className="h-6 bg-gray-200 rounded w-56 mb-4" />

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-5 shadow-sm"
            >
              <div className="h-5 bg-gray-200 rounded w-2/5 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Loading;