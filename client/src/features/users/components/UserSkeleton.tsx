function UserSkeleton() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <table className="w-full min-w-640px text-left">
        <thead className="border-b border-stone-200 dark:border-stone-800">
          <tr>
            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              User
            </th>
            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Email
            </th>
            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Role
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
          {Array.from({ length: 6 }).map((_, index) => (
            <tr key={index}>
              <td className="px-5 py-5">
                <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              </td>

              <td className="px-5 py-5">
                <div className="h-4 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              </td>

              <td className="px-5 py-5">
                <div className="h-6 w-24 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserSkeleton;