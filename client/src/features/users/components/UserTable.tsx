import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";
import type { User } from "../types/user.types";

interface UserTableProps {
  users: User[];
}

function UserTable({ users }: UserTableProps) {
  const updateStatusMutation = useUpdateUserStatus();

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center dark:border-stone-700 dark:bg-stone-900">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          No users found.
        </p>
      </div>
    );
  }

  const handleStatusChange = (user: User) => {
    updateStatusMutation.mutate({
      userId: user.id,
      isActive: !user.isActive,
    });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <table className="w-full min-w-760px text-left">
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

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Status
            </th>

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
          {users.map((user) => {
            const isUpdating =
              updateStatusMutation.isPending &&
              updateStatusMutation.variables?.userId === user.id;

            return (
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

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      user.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  {user.role === "ADMIN" ? (
                    <span className="text-xs text-stone-400">
                      Protected
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(user)}
                      disabled={isUpdating}
                      className="rounded-lg border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
                    >
                      {isUpdating
                        ? "Updating..."
                        : user.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {updateStatusMutation.isError && (
        <p className="border-t border-stone-200 px-5 py-3 text-sm text-red-600 dark:border-stone-800 dark:text-red-400">
          Failed to update user status. Please try again.
        </p>
      )}
    </div>
  );
}

export default UserTable;