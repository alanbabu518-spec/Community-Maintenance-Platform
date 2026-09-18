import type { UserRole } from "../types/user.types";

interface UserFiltersProps {
  search: string;
  role: UserRole | undefined;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | undefined) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
}

function UserFilters({
  search,
  role,
  sortOrder,
  onSearchChange,
  onRoleChange,
  onSortOrderChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search users..."
        className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-white"
      />

      <select
        value={role ?? ""}
        onChange={(event) =>
          onRoleChange(
            event.target.value
              ? (event.target.value as UserRole)
              : undefined,
          )
        }
        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-white"
      >
        <option value="">All roles</option>
        <option value="ADMIN">Admin</option>
        <option value="MANAGER">Manager</option>
        <option value="RESIDENT">Resident</option>
        <option value="TECHNICIAN">Technician</option>
      </select>

      <select
        value={sortOrder}
        onChange={(event) =>
          onSortOrderChange(event.target.value as "asc" | "desc")
        }
        className="rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-white"
      >
        <option value="desc">Newest</option>
        <option value="asc">Oldest</option>
      </select>
    </div>
  );
}

export default UserFilters;