import { useEffect, useState } from "react";
import { useCreateStaff } from "../hooks/useCreateStaff";
import type { CreateStaffInput } from "../types/user.types";
import { getCommunities } from "../../../services/location.api";
import type { Community } from "../../../services/location.api";

interface CreateStaffFormProps {
  onSuccess?: () => void;
}

function CreateStaffForm({ onSuccess }: CreateStaffFormProps) {
  const createStaffMutation = useCreateStaff();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);

  const [form, setForm] = useState<CreateStaffInput>({
    name: "",
    email: "",
    password: "",
    role: "TECHNICIAN",
    communityId: 0,
  });

  useEffect(() => {
    async function loadCommunities() {
      try {
        const result = await getCommunities();
        setCommunities(result.communities);
      } catch {
        setCommunities([]);
      } finally {
        setCommunitiesLoading(false);
      }
    }

    loadCommunities();
  }, []);

  const handleChange = (
    field: keyof CreateStaffInput,
    value: string | number,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.communityId) {
      return;
    }

    try {
      await createStaffMutation.mutateAsync(form);

      setForm({
        name: "",
        email: "",
        password: "",
        role: "TECHNICIAN",
        communityId: 0,
      });

      onSuccess?.();
    } catch {
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-white">
          Create Staff Account
        </h2>

        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Create a manager or technician account.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="staff-name"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Name
          </label>

          <input
            id="staff-name"
            type="text"
            value={form.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
            required
            minLength={2}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-white"
            placeholder="Staff name"
          />
        </div>

        <div>
          <label
            htmlFor="staff-email"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Email
          </label>

          <input
            id="staff-email"
            type="email"
            value={form.email}
            onChange={(event) =>
              handleChange("email", event.target.value)
            }
            required
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-white"
            placeholder="staff@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="staff-password"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Password
          </label>

          <input
            id="staff-password"
            type="password"
            value={form.password}
            onChange={(event) =>
              handleChange("password", event.target.value)
            }
            required
            minLength={8}
            maxLength={72}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-white"
            placeholder="8–72 characters"
          />
        </div>

        <div>
          <label
            htmlFor="staff-role"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Role
          </label>

          <select
            id="staff-role"
            value={form.role}
            onChange={(event) =>
              handleChange("role", event.target.value)
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-white"
          >
            <option value="TECHNICIAN">Technician</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="staff-community"
            className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Community
          </label>

          <select
            id="staff-community"
            value={form.communityId}
            onChange={(event) =>
              handleChange(
                "communityId",
                Number(event.target.value),
              )
            }
            required
            disabled={communitiesLoading}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-stone-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:focus:border-white"
          >
            <option value={0}>
              {communitiesLoading
                ? "Loading communities..."
                : "Select community"}
            </option>

            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {createStaffMutation.isError && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          Failed to create staff account. Please check the details and try
          again.
        </p>
      )}

      <button
        type="submit"
        disabled={
          createStaffMutation.isPending ||
          communitiesLoading ||
          !form.communityId
        }
        className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
      >
        {createStaffMutation.isPending
          ? "Creating..."
          : "Create Staff Account"}
      </button>
    </form>
  );
}

export default CreateStaffForm;