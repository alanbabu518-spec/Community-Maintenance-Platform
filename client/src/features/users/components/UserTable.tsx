import type { User } from "../types/user.types";

interface UserTableProps {
  users: User[];
}

function UserTable({ users }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          No users found.
        </p>
      </div>
    );
  }

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
          {users.map((user) => (
            <tr
              key={user.id}
              className="transition hover:bg-stone-50 dark:hover:bg-stone-800/50"
            >
              <td className="px-5 py-4">
                <p className="font-medium text-stone-900 dark:text-white">
                  {user.name}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-stone-500 dark:text-stone-400">
                {user.email}
              </td>

              <td className="px-5 py-4">
                <span className="inline-flex rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {user.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;