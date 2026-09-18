import { useState } from "react";
import { useUsers } from "../features/users/hooks/useUsers";
import UserFilters from "../features/users/components/UserFilters";
import UserTable from "../features/users/components/UserTable";
import type { UserRole } from "../features/users/types/user.types";
import UserSkeleton from "../features/users/components/UserSkeleton";
import CreateStaffForm from "../features/users/components/CreateStaffForm";

function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filters = {
    page,
    limit: 10,
    search: search || undefined,
    role,
    sortOrder,
  };

  const { data, isLoading, isError } = useUsers(filters);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (value: UserRole | undefined) => {
    setRole(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-56 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        </div>

        <div className="h-12 w-full animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800" />

        <UserSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-400px items-center justify-center">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Failed to load users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-900 dark:text-white">
          User Management
        </h1>

        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          Manage community residents and staff accounts.
        </p>
      </div>

      <CreateStaffForm />

      <UserFilters
        search={search}
        role={role}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onSortOrderChange={handleSortOrderChange}
      />

      <UserTable users={data?.users ?? []} />

      {data && data.pagination.totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {data.pagination.total} users
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!data.pagination.hasPreviousPage}
              onClick={() => setPage((current) => current - 1)}
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:text-white dark:hover:bg-stone-800"
            >
              Previous
            </button>

            <span className="text-sm text-stone-500 dark:text-stone-400">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={!data.pagination.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-900 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-700 dark:text-white dark:hover:bg-stone-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
